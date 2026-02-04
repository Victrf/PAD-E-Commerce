// models/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Pad",
    password: "kay2000",
    port: 5432,
    ssl: false,
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL Database"))
    .catch(err => console.error("❌ Database connection failed:", err.message));

export default pool;
