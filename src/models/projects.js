// src/models/projects.js
import db from './db.js';

/**
 * 1. Retrieve all service projects with their sponsoring organization names
 */
export const getAllProjects = async () => {
    const sql = `
        SELECT sp.project_id, sp.title, sp.date, sp.description, sp.location, o.name as organization_name 
        FROM service_project sp 
        JOIN organization o ON sp.organization_id = o.organization_id 
        ORDER BY sp.date;
    `;
    const result = await db.query(sql);
    return result.rows;
};

/**
 * 2. Retrieve a single service project by its primary ID
 */
// Open src/models/projects.js and update this specific function:
export const getProjectById = async (projectId) => {
    const sql = `
        SELECT sp.*, o.name as organization_name, o.logo as organization_logo
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const result = await db.query(sql, [projectId]);
    /* 🚀 FIXED: Return rows[0] so the controller gets a single object, not an array */
    return result.rows[0]; 
};
