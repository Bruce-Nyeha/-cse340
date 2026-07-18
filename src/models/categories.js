import db from './db.js';

/**
 * 1. Retrieve all categories from the database (ADDED BACK)
 */
export const getAllCategories = async () => {
    try {
        const queryText = 'SELECT category_id, category_name FROM category ORDER BY category_name;';
        const result = await db.query(queryText);
        return result.rows;
    } catch (error) {
        console.error("Error executing getAllCategories database read:", error);
        throw error;
    }
};

/**
 * 2. Retrieve a single category by its ID (FIXED TYPO)
 */
export const getCategoryById = async (categoryId) => {
    const sql = 'SELECT category_id, category_name FROM category WHERE category_id = $1;';
    const result = await db.query(sql, [categoryId]);
    return result.rows[0]; // Returns a single object instead of an array row index
};

/**
 * 3. Retrieve all categories assigned to a specific service project
 */
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

/**
 * 4. Retrieve all service projects belonging to a specific category
 */
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
