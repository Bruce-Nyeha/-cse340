import { validationResult, body } from 'express-validator';
import { 
    getAllOrganizations, 
    getOrganizationById, 
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (error) { next(error); }
};

export const showOrganizationDetailPage = async (req, res, next) => {
    try {
        const organization = await getOrganizationById(req.params.id);
        if (!organization) return res.status(404).send('Organization not found');
        const projects = await getProjectsByOrganizationId(req.params.id);
        res.render('organization-details', { title: organization.name, organization, projects });
    } catch (error) { next(error); }
};

export const showNewOrganizationForm = async (req, res, next) => {
    res.render('new-organization', { title: 'Register New Organization' });
};

export const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-organization');
        }
        await createOrganization(req.body.name, req.body.email, req.body.description);
        req.flash('success', 'Organization registered successfully!');
        res.redirect('/organizations');
    } catch (error) { next(error); }
};

export const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organization = await getOrganizationById(req.params.id);
        if (!organization) return res.status(404).send('Organization not found');
        res.render('edit-organization', { title: 'Edit Organization Profile', organization });
    } catch (error) { next(error); }
};

export const processEditOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect(`/edit-organization/${req.params.id}`);
        }
        await updateOrganization(req.params.id, req.body.name, req.body.email, req.body.description);
        req.flash('success', 'Organization profile updated successfully!');
        res.redirect('/organizations');
    } catch (error) { next(error); }
};

export const organizationValidation = [
    body('name').trim().notEmpty().withMessage('Name is required.').escape(),
    body('email').trim().isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('description').trim().notEmpty().withMessage('Description is required.').escape()
];
