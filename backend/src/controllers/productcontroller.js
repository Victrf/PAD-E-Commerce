// controllers/productController.js
import { ProductModel } from "../models/productModel.js";
import fs from "fs";
import path from "path";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAll();
        res.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error fetching products" });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.getById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error fetching product" });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

        const newProduct = await ProductModel.create({ name, price, description, image_url });
        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error creating product" });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        let image_url = req.body.image_url; // keep existing if not uploading new
        if (req.file) {
            image_url = `/uploads/products/${req.file.filename}`;
        }


        const updatedProduct = await ProductModel.update(id, { name, price, description, image_url });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error updating product" });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductModel.delete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove uploaded file from server if exists
        if (deletedProduct.image_url) {
            const filePath = path.join(process.cwd(), deletedProduct.image_url);
            fs.unlink(filePath, (err) => {
                if (err) console.warn("Failed to delete file:", err);
            });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error deleting product" });
    }
};
