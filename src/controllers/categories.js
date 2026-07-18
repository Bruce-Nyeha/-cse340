// Open src/controllers/categories.js and make sure it handles both views
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Categories', categories });
    } catch (error) {
        next(error);
    }
};

// NEW: Category details page controller (/category/[id])
export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id; // Extracts the ID from the route path parameter
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        res.render('category-details', { 
            title: `${category.category_name} Projects`, 
            category, 
            projects 
        });
    } catch (error) {
        next(error);
    }
};
