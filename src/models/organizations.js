import db from './db.js';

export const getAllOrganizations = async () => {
    const sql = 'SELECT organization_id, name, email, description, logo FROM organization ORDER BY name;';
    const result = await db.query(sql);
    return result.rows;
};

export const getOrganizationById = async (orgId) => {
    const sql = 'SELECT organization_id, name, email, description, logo FROM organization WHERE organization_id = $1;';
    const result = await db.query(sql, [orgId]);
    return result.rows[0];
};

export const getProjectsByOrganizationId = async (orgId) => {
    const sql = 'SELECT project_id, title, date, location, description FROM service_project WHERE organization_id = $1 ORDER BY date;';
    const result = await db.query(sql, [orgId]);
    return result.rows;
};

export const createOrganization = async (name, email, description) => {
    const sql = 'INSERT INTO organization (name, email, description) VALUES ($1, $2, $3) RETURNING organization_id;';
    const result = await db.query(sql, [name, email, description]);
    return result.rows[0].organization_id;
};

export const updateOrganization = async (orgId, name, email, description) => {
    const sql = 'UPDATE organization SET name = $1, email = $2, description = $3 WHERE organization_id = $4 RETURNING organization_id;';
    const result = await db.query(sql, [name, email, description, orgId]);
    return result.rows[0].organization_id;
};
