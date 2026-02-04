// routes/productRoutes.js
import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../middleware/uploadMiddleware.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES (require authentication)
// Use uploadProductImage middleware to save in /uploads/products
router.post("/", verifyAdmin, uploadProductImage.single("image"), createProduct);
router.put("/:id", verifyAdmin, uploadProductImage.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
