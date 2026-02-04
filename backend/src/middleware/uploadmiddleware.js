// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Product uploads
const productUploadDir = "uploads/products";
ensureDir(productUploadDir);

// Custom order uploads
const customOrderUploadDir = "uploads/custom_orders";
ensureDir(customOrderUploadDir);

// Generic multer storage factory
const storageFactory = (uploadDir) => multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter: allow only images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
};

// Export separate upload middlewares
export const uploadProductImage = multer({
    storage: storageFactory(productUploadDir),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: imageFileFilter,
});

export const uploadCustomOrderFiles = multer({
    storage: storageFactory(customOrderUploadDir),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
});
