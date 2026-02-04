// routes/adminRoutes.js
import express from "express";
import {
    getAllProducts,
    updateProduct,
    deleteProduct,
    getAllCustomOrders,
    getAllContacts,
    adminLogin // <-- import the new login function
} from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/authMiddleware.js";
import { verifyAdminToken } from "../controllers/adminController.js";

const router = express.Router();



router.get("/verify", verifyAdminToken);

// Admin login route
router.post("/login", adminLogin);

// ------------------ PRODUCT ROUTES ------------------
// Get all products
router.get("/products", verifyAdmin, getAllProducts);

// Update a product
router.put("/products/:id", verifyAdmin, updateProduct);

// Delete a product
router.delete("/products/:id", verifyAdmin, deleteProduct);

// ------------------ CUSTOM ORDER ROUTES ------------------
// Get all custom orders
router.get("/custom-orders", verifyAdmin, getAllCustomOrders);

// ------------------ CONTACT FORM ROUTES ------------------
// Get all contact form submissions
router.get("/contacts", verifyAdmin, getAllContacts);

export default router;
