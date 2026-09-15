import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/productModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({}).sort({ name: 1 });

        console.log("Checking first 5 products:");
        products.slice(0, 5).forEach(p => {
            console.log(`${p.name}: ${p.image}`);
        });

    } catch (e) {
        console.error(e);
    }
    process.exit();
};

run();
