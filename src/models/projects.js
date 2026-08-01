// src/models/projects.js
import { query } from './db.js';

export const getAllProjects = async () => {
    const sql = `
        SELECT sp.*, o.name as organization_name 
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.date;
    `;
    const result = await query(sql);
    return result.rows;
};

export const getProjectById = async (projectId) => {
    const sql = `
        SELECT sp.*, o.name as organization_name, o.logo as organization_logo
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const result = await query(sql, [projectId]);
    return result.rows;
};

export const createProject = async (title, description, date, location, organization_id) => {
    const sql = 'INSERT INTO service_project (title, description, date, location, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING project_id;';
    const result = await query(sql, [title, description, date, location, organization_id]);
    return result.rows.project_id;
};

export const updateProject = async (projectId, title, description, date, location, organization_id) => {
    const sql = 'UPDATE service_project SET title = $1, description = $2, date = $3, location = $4, organization_id = $5 WHERE project_id = $6 RETURNING project_id;';
    const result = await query(sql, [title, description, date, location, organization_id, projectId]);
    return result.rows.project_id;
};
