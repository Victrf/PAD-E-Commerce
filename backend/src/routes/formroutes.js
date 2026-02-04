// routes/formRoutes.js
import express from "express";
import {
    submitCustomOrder,
    getCustomOrders,
    submitContactForm,
    markAsProcessed,
    deleteSubmission,
    getContactForms
} from "../controllers/formController.js";

import { verifyAdmin } from "../middleware/authMiddleware.js";
import { uploadCustomOrderFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/custom-order", uploadCustomOrderFiles.array("referenceUpload"), submitCustomOrder);
router.post("/contact", submitContactForm);

// Admin protected routes
router.get("/custom-orders", verifyAdmin, getCustomOrders);
router.get("/contacts", verifyAdmin, getContactForms);

// ✅ Mark submission as processed (includes type)
router.patch("/submissions/:type/:id/processed", verifyAdmin, markAsProcessed);

// ✅ Delete submission (also includes type)
// Delete submission by type and id
router.delete("/submissions/:type/:id", verifyAdmin, deleteSubmission);



export default router;
