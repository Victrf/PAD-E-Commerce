import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkDB() {
    try {
        const client = await pool.connect();
        console.log("✅ Connected to DB successfully");
        client.release();
    } catch (err) {
        console.error("❌ Connection error:", err);
    } finally {
        await pool.end();
    }
}

checkDB();
