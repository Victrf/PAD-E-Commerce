// models/customOrderModel.js
import pool from "./db.js";

export const CustomOrderModel = {
    async createOrder(bag_description, contact_method, contact_info, file_paths = []) {
        const result = await pool.query(
            `INSERT INTO custom_orders (bag_description, contact_method, contact_info, file_paths)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [bag_description, contact_method, contact_info, file_paths]
        );
        return result.rows[0];
    },

    async getAllOrders() {
        const result = await pool.query(`SELECT * FROM custom_orders ORDER BY created_at DESC`);
        return result.rows;
    }
};
