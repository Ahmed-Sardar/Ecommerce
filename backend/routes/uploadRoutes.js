import path from 'path';
import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// Local storage engine
const localStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// Middleware factory
// const getUploadMiddleware = () => {
//     if (process.env.CLOUDINARY_CLOUD_NAME) {
//         // If Cloudinary is set, use it
//         const storage = new CloudinaryStorage({
//             cloudinary: cloudinary.v2,
//             params: {
//                 folder: 'amazon_clone',
//                 allowed_formats: ['jpg', 'jpeg', 'png'],
//             }
//         });
//         return multer({ storage });
//     } else {
//         // Fallback to local
//         return multer({
//             storage: localStorage,
//             fileFilter: function (req, file, cb) {
//                 checkFileType(file, cb);
//             },
//         });
//     }
// };

const getUploadMiddleware = () => {
    console.log("Using LOCAL storage");

    return multer({
        storage: localStorage,
        fileFilter(req, file, cb) {
            checkFileType(file, cb);
        },
    });
};

// router.post('/', (req, res, next) => {
    
//     const upload = getUploadMiddleware();
//     // upload.single('image')(req, res, (err) => {
//     //     if (err) {
//     //         return res.status(400).send({ message: err.message });
//     //     }

//     upload.single('image')(req, res, (err) => {
//     console.log("Upload Error:", err);
//     console.log("File:", req.file);

//     if (err) {
//         return res.status(400).json({ message: err.message });
//     }

//     // rest of your code...
// });
//         if (process.env.CLOUDINARY_CLOUD_NAME) {
//             // Cloudinary storage returns path in file.path or file.secure_url?
//             // multer-storage-cloudinary puts url in file.path usually
//             res.send({
//                 message: 'Image uploaded',
//                 image: req.file.path,
//             });
//         } else {
//             res.send({
//                 message: 'Image uploaded',
//                 image: `/${req.file.path.replace(/\\/g, '/')}`,
//             });
//         }
//     });

router.post('/', (req, res) => {
    console.log("Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Using Cloudinary:", !!process.env.CLOUDINARY_CLOUD_NAME);
    const upload = getUploadMiddleware();

    upload.single('image')(req, res, (err) => {
        console.log("Upload Error:", err);
        console.log("File:", req.file);

        if (err) {
            return res.status(400).json({
                message: err.message || err,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        if (process.env.CLOUDINARY_CLOUD_NAME) {
            return res.json({
                message: "Image uploaded",
                image: req.file.path,
            });
        }

        return res.json({
            message: "Image uploaded",
            image: `/${req.file.path.replace(/\\/g, '/')}`,
        });
    });
});

// });

export default router;
