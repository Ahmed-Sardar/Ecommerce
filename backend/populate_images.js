import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import products from './seed/products_curated.js';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Ensure directory exists
const seedImagesDir = path.join(__dirname, 'seed_images');
if (!fs.existsSync(seedImagesDir)) {
    fs.mkdirSync(seedImagesDir, { recursive: true });
}

// Connect DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const downloadImage = async (url, filepath) => {
    try {
        if (!url || !url.startsWith('http')) {
            console.log(`Skipping invalid URL: ${url}`);
            return false;
        }

        // If file exists and is larger than 0 bytes, skip download to save time/bandwidth
        // unless we want to force refresh. Ideally checking existence is enough.
        if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
            // console.log(`File exists, skipping download: ${path.basename(filepath)}`);
            return true;
        }

        let response = await fetch(url);

        // Fallback for 404/403 on direct links (common with some Unsplash IDs)
        if (!response.ok) {
            console.log(`Direct link failed (${response.status}), trying download endpoint...`);
            const idMatch = url.match(/photo-([A-Za-z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                // Try the download endpoint which redirects to the real image
                const downloadUrl = `https://unsplash.com/photos/${idMatch[1]}/download?force=true`;
                response = await fetch(downloadUrl);
            }
        }

        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        console.log(`Downloaded: ${path.basename(filepath)}`);
        return true;
    } catch (error) {
        console.error(`Error downloading to ${filepath}:`, error.message);
        return false;
    }
};

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const run = async () => {
    await connectDB();

    console.log(`Processing ${products.length} products from seed data...`);

    // We need an admin user to assign products to
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
        console.error('Admin user not found. Please seed users first.');
        process.exit(1);
    }

    try {
        // Optional: clear existing products to ensure clean slate?
        // User said "Replace ALL placeholder...", effectively replacing content.
        // But maybe we just update. Let's start fresh or upsert.
        // User requested "update or create a seed script... that inserts products".
        // To ensure no duplicates or old garbage, deleteMany might be cleaner, 
        // but upsert is safer if we want to keep IDs? 
        // Let's go with upsert based on name to preserve continuity if possible, 
        // but cleaning up is arguably better for "Replace ALL".
        // Let's stick to upsert for now to be safe against destroying orders etc.

        for (const p of products) {
            const slug = slugify(p.name);
            const filename = `${slug}.jpg`;
            const filepath = path.join(seedImagesDir, filename);

            console.log(`Processing: ${p.name}`);

            // Download image
            const success = await downloadImage(p.image, filepath);

            if (success) {
                // Update product object
                const localImagePath = `/seed_images/${filename}`;

                const productData = {
                    ...p,
                    user: adminUser._id,
                    image: localImagePath,
                    images: [localImagePath] // Ensure array is also updated if used
                };

                // Upsert into DB
                await Product.findOneAndUpdate(
                    { name: p.name },
                    productData,
                    { upsert: true, new: true }
                );
            }
        }

        console.log('Images downloaded and database updated successfully!');
        process.exit();
    } catch (error) {
        console.error('Error in seeding:', error);
        process.exit(1);
    }
};

run();
