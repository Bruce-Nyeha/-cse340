import db from './db.js';

export const getAllCategories = async () => {
    const sql = 'SELECT category_id, category_name FROM category ORDER BY category_name;';
    const result = await db.query(sql);
    return result.rows;
};

export const getCategoryById = async (categoryId) => {
    const sql = 'SELECT category_id, category_name FROM category WHERE category_id = $1;';
    const result = await db.query(sql, [categoryId]);
    return result.rows[0];
};

export const getCategoriesByProjectId = async (projectId) => {
    const sql = `
        SELECT c.category_id, c.category_name 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;
    const result = await db.query(sql, [projectId]);
    return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
    const sql = `
        SELECT sp.project_id, sp.title, sp.date, o.name as organization_name
        FROM service_project sp
        JOIN project_category pc ON sp.project_id = pc.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.date;
    `;
    const result = await db.query(sql, [categoryId]);
    return result.rows;
};

export const createCategory = async (categoryName) => {
    const sql = 'INSERT INTO category (category_name) VALUES ($1) RETURNING category_id;';
    const result = await db.query(sql, [categoryName]);
    return result.rows[0].category_id;
};

export const updateCategory = async (categoryId, categoryName) => {
    const sql = 'UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING category_id;';
    const result = await db.query(sql, [categoryName, categoryId]);
    return result.rows[0].category_id;
};

export const updateProjectCategories = async (projectId, categoryIds) => {
    await db.query('DELETE FROM project_category WHERE project_id = $1;', [projectId]);
    if (categoryIds) {
        const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
        for (const catId of ids) {
            await db.query('INSERT INTO project_category (project_id, category_id) VALUES ($1, $2);', [projectId, catId]);
        }
    }
};
