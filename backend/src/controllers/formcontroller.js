// controllers/formController.js
import pool from "../models/db.js";
import path from "path";
import fs from "fs";


// -------------------
// Submit Custom Order
// -------------------
export const submitCustomOrder = async (req, res) => {
    try {
        const { bagDescription, contactMethod, contactInfo } = req.body;

        // Validate required fields
        if (!bagDescription || !contactMethod || !contactInfo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Handle uploaded files
        let filePaths = [];
        if (req.files && req.files.length > 0) {
            filePaths = req.files.map(file => file.path); // store relative file paths
        }

        const result = await pool.query(
            `INSERT INTO custom_orders (bag_description, contact_method, contact_info, file_paths)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [bagDescription, contactMethod, contactInfo, filePaths]
        );

        res.status(201).json({
            message: "Custom order submitted successfully",
            order: result.rows[0],
        });
    } catch (error) {
        console.error("Error submitting custom order:", error);
        res.status(500).json({ message: "Server error while submitting custom order" });
    }
};

// -------------------
// Get all Custom Orders (Admin)
// -------------------
export const getCustomOrders = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM custom_orders ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching custom orders:", error);
        res.status(500).json({ message: "Server error while fetching custom orders" });
    }
};

// ✅ Mark a submission as processed
export const markAsProcessed = async (req, res) => {
    const { id, type } = req.params;

    try {
        let query, tableName;

        if (type === "custom_order") {
            query = "UPDATE custom_orders SET processed = TRUE WHERE id = $1 RETURNING *";
            tableName = "Custom Order";
        } else if (type === "contact") {
            query = "UPDATE contact_forms SET processed = TRUE WHERE id = $1 RETURNING *";
            tableName = "Contact Form";
        } else {
            return res.status(400).json({ message: "Invalid submission type" });
        }

        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ message: `${tableName} not found` });

        res.json({ message: `${tableName} marked as processed`, data: rows[0] });
    } catch (error) {
        console.error("Error marking as processed:", error);
        res.status(500).json({ message: "Server error marking as processed" });
    }
};


// ✅ Delete a submission
export const deleteSubmission = async (req, res) => {
    const { id, type } = req.params;
    try {
        let result;
        if (type === "custom_order") {
            result = await pool.query("DELETE FROM custom_orders WHERE id = $1 RETURNING *", [id]);
        } else if (type === "contact") {
            result = await pool.query("DELETE FROM contact_forms WHERE id = $1 RETURNING *", [id]);
        } else {
            return res.status(400).json({ message: "Invalid submission type" });
        }

        if (!result.rows.length) return res.status(404).json({ message: "Submission not found" });

        res.json({ message: "Submission deleted", data: result.rows[0] });
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).json({ message: "Server error deleting submission" });
    }
};


// -------------------
// Submit Contact Form
// -------------------
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }

        const result = await pool.query(
            `INSERT INTO contact_forms (name, email, phone, subject, message)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, phone || "", subject || "", message]
        );

        res.status(201).json({
            message: "Contact form submitted successfully",
            contact: result.rows[0],
        });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Server error while submitting contact form" });
    }
};


// -------------------
// Get all Contact Forms (Admin)
// -------------------
export const getContactForms = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM contact_forms ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching contact forms:", error);
        res.status(500).json({ message: "Server error while fetching contact forms" });
    }
};
