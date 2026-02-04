// models/adminModel.js
import pool from "./db.js";
import bcrypt from "bcrypt";

export const AdminModel = {
    // Find admin by email
    async findByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );
        return result.rows[0];
    },

    // Create new admin
    async createAdmin(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );
        return result.rows[0];
    },
};
