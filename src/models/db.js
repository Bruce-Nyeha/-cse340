// src/models/db.js
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

//  Force an explicit absolute path lookup to find your .env file coordinates
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

if (!process.env.DB_URL) {
    console.error(' CRITICAL SCHEDULER BLOCK: process.env.DB_URL is missing or undefined! Check your local .env configuration parameters.');
}

export const db = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false }
});

export const query = async (text, params) => {
    return db.query(text, params);
};
