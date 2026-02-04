// models/contactModel.js
import pool from "./db.js";

export const ContactModel = {
    async createContact(name, email, phone, subject, message) {
        const result = await pool.query(
            `INSERT INTO contact_forms (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, phone, subject, message]
        );
        return result.rows[0];
    },

    async getAllContacts() {
        const result = await pool.query(`SELECT * FROM contact_forms ORDER BY created_at DESC`);
        return result.rows;
    }
};
