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

export { getAllProjects };