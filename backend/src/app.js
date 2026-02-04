// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";


// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import formRoutes from "./routes/formRoutes.js"; // <-- Import form routes
import adminRoutes from "./routes/adminRoutes.js";

import './models/db.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);  // <-- Admin API

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/forms", formRoutes); // <-- Register form routes

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
