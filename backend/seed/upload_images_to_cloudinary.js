import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' }); // Load .env from backend root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedImagesDir = path.join(__dirname, '../seed_images');
const mapFile = path.join(__dirname, 'cloudinary_image_map.json');

const uploadImages = async () => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.log('Cloudinary config missing, skipping upload.');
            return;
        }

        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const files = fs.readdirSync(seedImagesDir);
        const urlMap = {};

        console.log(`Found ${files.length} images to upload...`);

        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                try {
                    const result = await cloudinary.v2.uploader.upload(path.join(seedImagesDir, file), {
                        folder: 'amazon_clone_seed',
                        use_filename: true,
                        unique_filename: false,
                    });
                    urlMap[file] = result.secure_url;
                    console.log(`Uploaded ${file} -> ${result.secure_url}`);
                } catch (e) {
                    console.error(`Failed to upload ${file}:`, e.message);
                }
            }
        }

        fs.writeFileSync(mapFile, JSON.stringify(urlMap, null, 2));
        console.log('Image map saved to', mapFile);

    } catch (error) {
        console.error('Error in upload script:', error);
    }
};

uploadImages();
