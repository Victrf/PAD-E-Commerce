import dotenv from "dotenv";
dotenv.config();

// controllers/adminController.js
import { ProductModel } from "../models/productModel.js";
import { AdminModel } from "../models/adminModel.js";
import { CustomOrderModel } from "../models/customOrderModel.js";
import { ContactModel } from "../models/contactModel.js";
import pool from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// ------------------Token verification ------------------
export const verifyAdminToken = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({ message: "Token is valid", admin: decoded });
    } catch (err) {
        res.status(401).json({ message: "Token is invalid or expired" });
    }
};
// ------------------ ADMIN LOGIN ------------------

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await pool.query("SELECT * FROM admins WHERE email=$1", [email]);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ------------------ PRODUCT MANAGEMENT ------------------

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll();
        res.json({ products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error fetching products" });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image_url } = req.body;

        const updatedProduct = await ProductModel.update(id, { name, price, description, image_url });
        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Server error updating product" });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.remove(id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Server error deleting product" });
    }
};

// ------------------ CUSTOM ORDERS ------------------

// Get all custom orders
export const getAllCustomOrders = async (req, res) => {
    try {
        const orders = await CustomOrderModel.findAll();
        res.json({ orders });
    } catch (err) {
        console.error("Error fetching custom orders:", err);
        res.status(500).json({ message: "Server error fetching custom orders" });
    }
};

// ------------------ CONTACT FORMS ------------------

// Get all contact form submissions
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.findAll();
        res.json({ contacts });
    } catch (err) {
        console.error("Error fetching contact forms:", err);
        res.status(500).json({ message: "Server error fetching contact forms" });
    }
};
