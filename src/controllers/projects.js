import { validationResult, body } from 'express-validator';
import { getAllProjects, getProjectById, createProject, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories, getCategoriesByProjectId, updateProjectCategories } from '../models/categories.js';

export const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (error) { next(error); }
};

export const showProjectDetailPage = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) return res.status(404).send('Project not found');
        const categories = await getCategoriesByProjectId(req.params.id);
        res.render('project-details', { title: project.title, project, categories });
    } catch (error) { next(error); }
};

export const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { title: 'Create New Project', organizations });
    } catch (error) { next(error); }
};

export const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-project');
        }
        await createProject(req.body.title, req.body.description, req.body.date, req.body.location, req.body.organization_id);
        req.flash('success', 'Service project created successfully!');
        res.redirect('/projects');
    } catch (error) { next(error); }
};

export const showEditProjectForm = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) return res.status(404).send('Project not found');
        const organizations = await getAllOrganizations();
        res.render('edit-project', { title: 'Edit Service Project', project, organizations });
    } catch (error) { next(error); }
};

export const processEditProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect(`/edit-project/${req.params.id}`);
        }
        await updateProject(req.params.id, req.body.title, req.body.description, req.body.date, req.body.location, req.body.organization_id);
        req.flash('success', 'Service project updated successfully!');
        res.redirect('/projects');
    } catch (error) { next(error); }
};

export const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) return res.status(404).send('Project not found');
        const allCategories = await getAllCategories();
        const currentCategories = await getCategoriesByProjectId(req.params.id);
        res.render('assign-categories', { title: 'Assign Project Categories', project, allCategories, currentCategories });
    } catch (error) { next(error); }
};

export const processAssignCategoriesForm = async (req, res, next) => {
    try {
        await updateProjectCategories(req.params.id, req.body.category_ids);
        req.flash('success', 'Project category assignments saved successfully!');
        res.redirect(`/project/${req.params.id}`);
    } catch (error) { next(error); }
};

export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.').escape(),
    body('description').trim().notEmpty().withMessage('Description is required.').escape(),
    body('date').notEmpty().withMessage('Valid date is required.'),
    body('location').trim().notEmpty().withMessage('Location is required.').escape(),
    body('organization_id').notEmpty().withMessage('Organization sponsor is required.')
];
