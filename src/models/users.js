// src/models/users.js
import bcrypt from 'bcryptjs';

// Imports the named query function from your clean db.js file
import { query } from './db.js';

/**
 * Inserts a new user record into the database table
 */
export const createUser = async (name, email, passwordHash) => {
    const queryText = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING user_id;
    `;
    
    const defaultRoleId = 1; // Default 'Student' role
    const queryParams = [name.trim(), email, passwordHash, defaultRoleId];
    const result = await query(queryText, queryParams);
    
    if (result.rows.length === 0) {
        throw new Error('Failed to create user record inside the database.');
    }
    
    return result.rows[0].user_id;
};

/**
 * Find a single user by their email address
 */
export const findUserByEmail = async (email) => {
    const queryText = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1;
    `;
    const result = await query(queryText, [email]);
    if (result.rows.length === 0) {
        return null; 
    }
    return result.rows[0];
};

/**
 * Master verification handler used to securely log a user session in
 */
export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    delete user.password_hash;
    return user;
};
