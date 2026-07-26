import { body, validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory, 
    updateCategory 
} from '../models/categories.js';

// 1. GET /categories - List categories
export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Categories', categories });
    } catch (error) { next(error); }
};

// 2. GET /category/:id - Show projects for a specific category (🚀 REQUIRED EXPORT FIXED)
export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryRows = await getCategoryById(categoryId);
        const category = categoryRows[0]; // Extract the singular category object
        
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
    } catch (error) { next(error); }
};

// 3. GET /new-category - Show form
export const showNewCategoryForm = async (req, res, next) => {
    res.render('new-category', { title: 'Add New Category' });
};

// 4. POST /new-category - Handle creation
export const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-category');
        }
        await createCategory(req.body.category_name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) { next(error); }
};

// 5. GET /edit-category/:id - Show edit form
export const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryRows = await getCategoryById(req.params.id);
        const category = categoryRows[0];
        if (!category) return res.status(404).send('Category not found');
        res.render('edit-category', { title: 'Edit Category', category });
    } catch (error) { next(error); }
};

// 6. POST /edit-category/:id - Handle update
export const processEditCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect(`/edit-category/${req.params.id}`);
        }
        await updateCategory(req.params.id, req.body.category_name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) { next(error); }
};

// 🚀 Validation Schema
export const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters.')
        .escape()
];
