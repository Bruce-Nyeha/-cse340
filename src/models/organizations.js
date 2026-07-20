import db from './db.js';


export const getAllOrganizations = async () => {
    
    const sql = 'SELECT organization_id, name, email, description, logo FROM organization ORDER BY name;';
    const result = await db.query(sql);
    return result.rows;
};


export const getOrganizationById = async (orgId) => {
    
    const sql = 'SELECT organization_id, name, email, description, logo FROM organization WHERE organization_id = $1;';
    const result = await db.query(sql, [orgId]);
    return result.rows[0]; // Returns the single object row cleanly
};


export const getProjectsByOrganizationId = async (orgId) => {
    const sql = 'SELECT * FROM service_project WHERE organization_id = $1 ORDER BY date;';
    const result = await db.query(sql, [orgId]);
    return result.rows;
};
