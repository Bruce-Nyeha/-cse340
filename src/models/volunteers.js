// src/models/volunteers.js
import { query } from './db.js';

/**
 * Check if a specific user is already volunteering for a specific project
 */
export const isUserVolunteering = async (userId, projectId) => {
    const sql = 'SELECT 1 FROM project_volunteer WHERE user_id = $1 AND project_id = $2;';
    const result = await query(sql, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Add a user as a volunteer to a project
 */
export const addVolunteer = async (userId, projectId) => {
    const sql = 'INSERT INTO project_volunteer (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;';
    await query(sql, [userId, projectId]);
};

/**
 * Remove a user from volunteering for a project
 */
export const removeVolunteer = async (userId, projectId) => {
    const sql = 'DELETE FROM project_volunteer WHERE user_id = $1 AND project_id = $2;';
    await query(sql, [userId, projectId]);
};

/**
 * Retrieve all service projects a specific user has volunteered for
 */
export const getProjectsByVolunteer = async (userId) => {
    const sql = `
        SELECT sp.*, o.name as organization_name 
        FROM service_project sp
        JOIN project_volunteer pv ON sp.project_id = pv.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.date;
    `;
    const result = await query(sql, [userId]);
    return result.rows;
};
