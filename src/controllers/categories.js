// src/controllers/categories.js
import { validationResult, body } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from '../models/categories.js';

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Categories', categories });
    } catch (error) { next(error); }
};

export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryRows = await getCategoryById(req.params.id);
        const category = categoryRows[0]; // 🚀 FIXED: Extract the single row object out of the array matrix
        if (!category) return res.status(404).send('Category not found');
        
        const projects = await getProjectsByCategoryId(req.params.id);
        res.render('category-details', { title: category.category_name, category, projects });
    } catch (error) { next(error); }
};

export const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

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

export const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryRows = await getCategoryById(req.params.id);
        const category = categoryRows[0]; // 🚀 FIXED: Unpacks rows cleanly so edit view loads instead of crashing!
        if (!category) {
            req.flash('error', 'Category not found inside the tracking index.');
            return res.redirect('/categories');
        }
        res.render('edit-category', { title: 'Edit Category Name', category });
    } catch (error) { next(error); }
};

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

export const categoryValidation = [
    body('category_name').trim().notEmpty().withMessage('Category name field is required.').escape()
];
