import db from './db.js';

const getAllProjects = async () => {
  const sql = `
    SELECT 
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.date,
      o.name
    FROM service_project sp
    JOIN organization o
      ON sp.organization_id = o.organization_id
    ORDER BY sp.date;
  `;

  const result = await db.query(sql);
  return result.rows;
}

// Add this to the bottom of src/models/projects.js
export const getProjectById = async (projectId) => {
    const sql = `
        SELECT sp.*, o.name as organization_name 
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const result = await db.query(sql, [projectId]);
    return result.rows[0]; // Returns just one single project object
};


export { getAllProjects };