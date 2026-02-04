// create-admin.js
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "./models/db.js";

dotenv.config();

const createAdmin = async () => {
    try {
        const email = "admin@example.com"; // Replace with your desired admin email
        const password = "Admin123!";      // Replace with your desired password

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const result = await pool.query(
            "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );

        console.log("✅ Admin created successfully:", result.rows[0]);
        process.exit(0);
    } catch (err) {
        if (err.code === "23505") {
            console.error("❌ Admin with this email already exists.");
        } else {
            console.error("❌ Error creating admin:", err.message);
        }
        process.exit(1);
    }
};

createAdmin();
