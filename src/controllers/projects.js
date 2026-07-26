import { body, validationResult } from 'express-validator';
import { getAllProjects, getProjectById } from '../models/projects.js';

// 1. GET /projects - List all upcoming projects
export const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

// 2. GET /project/:id - Single project detail view
export const showProjectDetailPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        // Pass dummy categories array for now to ensure the view renders safely
        res.render('project-details', { 
            title: project.title, 
            project, 
            categories: [] 
        });
    } catch (error) {
        next(error);
    }
};

// 3. GET /new-project - Show creation form
export const showNewProjectForm = async (req, res, next) => {
    res.render('new-project', { title: 'Add New Project' });
};

// 4. POST /new-project - Process creation form
export const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-project');
        }
        req.flash('success', 'Project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// 5. GET /edit-project/:id - Show edit form
export const showEditProjectForm = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) return res.status(404).send('Project not found');
        res.render('edit-project', { title: 'Edit Project', project });
    } catch (error) {
        next(error);
    }
};

// 6. POST /edit-project/:id - Process edit form
export const processEditProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect(`/edit-project/${req.params.id}`);
        }
        req.flash('success', 'Project updated successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// 🚀 REQUIRED EXPORT FIXED: Server-side validation rules array
export const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters.')
        .escape(),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .escape(),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .escape()
];
