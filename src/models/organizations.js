import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}



export const getOrganizationById = async (orgId) => {
    const sql = 'SELECT * FROM organization WHERE organization_id = $1;';
    const result = await db.query(sql, [orgId]);
    return result.rows[0];
};

export const getProjectsByOrganizationId = async (orgId) => {
    const sql = 'SELECT * FROM service_project WHERE organization_id = $1 ORDER BY date;';
    const result = await db.query(sql, [orgId]);
    return result.rows;
};


export {getAllOrganizations} 