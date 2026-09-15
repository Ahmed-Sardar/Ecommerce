import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import users from './users.js';
import products from './products_curated.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mapFile = path.join(__dirname, 'cloudinary_image_map.json');

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // await User.insertMany(users); // insertMany prevents pre-save hooks (middleware) from running
        const createdUsers = [];
        for (const user of users) {
            const createdUser = await User.create(user);
            createdUsers.push(createdUser);
        }

        const adminUser = createdUsers[0]._id;

        // Load image map if exists
        let imageMap = {};
        if (fs.existsSync(mapFile)) {
            imageMap = JSON.parse(fs.readFileSync(mapFile));
        }

        const sampleProducts = products.map((product) => {
            // Try to replace local image path with Cloudinary URL from map
            const fileName = path.basename(product.image);
            let imageUrl = product.image;

            if (imageMap[fileName]) {
                imageUrl = imageMap[fileName];
            }

            return { ...product, user: adminUser, image: imageUrl, images: [imageUrl] };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
