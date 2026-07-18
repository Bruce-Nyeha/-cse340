// src/models/db.js
import pg from 'pg';
import dotenv from 'dotenv';

//  CRITICAL FIX: Explicitly load the local .env variables directly inside this module!
dotenv.config();

const { Pool } = pg;

// Standard connection pool utilizing your active environment credentials string
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Direct export wrapper ensuring all your application modules can read data smoothly
export const db = {
    async query(text, params) {
        return await pool.query(text, params);
    },
    async close() {
        await pool.end();
    }
};

export const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export default db;
