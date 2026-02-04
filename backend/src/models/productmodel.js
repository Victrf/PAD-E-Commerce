// models/productModel.js
import pool from "./db.js";

export const ProductModel = {
    // Create a new product
    async create({ name, price, description, image_url }) {
        const result = await pool.query(
            `INSERT INTO products (name, price, description, image_url)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, price, description, image_url]
        );
        return result.rows[0];
    },

    // Get all products
    async getAll() {
        const result = await pool.query(
            `SELECT * FROM products ORDER BY created_at DESC`
        );
        return result.rows;
    },

    // Get a single product by ID
    async getById(id) {
        const result = await pool.query(
            `SELECT * FROM products WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Update a product by ID
    async update(id, { name, price, description, image_url }) {
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, price = $2, description = $3, image_url = $4
             WHERE id = $5 RETURNING *`,
            [name, price, description, image_url, id]
        );
        return result.rows[0];
    },

    // Delete a product by ID
    async delete(id) {
        const result = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },
};
