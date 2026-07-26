import { body, validationResult } from 'express-validator';
import { 
    getAllOrganizations, 
    getOrganizationById, 
    getProjectsByOrganizationId 
} from '../models/organizations.js';

// 1. GET /organizations - List all organizations
export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (error) {
        next(error); 
    }
};

// 2. GET /organization/:id - Detail view page
export const showOrganizationDetailPage = async (req, res, next) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);
        
        if (!organization) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }
        
        const projects = await getProjectsByOrganizationId(orgId);
        res.render('organization-details', { 
            title: organization.name, 
            organization, 
            projects 
        });
    } catch (error) {
        next(error);
    }
};

// 3. GET /new-organization - Show creation form
export const showNewOrganizationForm = async (req, res, next) => {
    res.render('new-organization', { title: 'Add New Organization' });
};

// 4. POST /new-organization - Process creation form
export const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-organization');
        }
        // Place your model insertion call here when ready
        req.flash('success', 'Organization created successfully!');
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

// 5. GET /edit-organization/:id - Show edit form
export const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organization = await getOrganizationById(req.params.id);
        if (!organization) return res.status(404).send('Organization not found');
        res.render('edit-organization', { title: 'Edit Organization', organization });
    } catch (error) {
        next(error);
    }
};

// 6. POST /edit-organization/:id - Process edit form
export const processEditOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect(`/edit-organization/${req.params.id}`);
        }
        // Place your model update call here when ready
        req.flash('success', 'Organization updated successfully!');
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

// 🚀 REQUIRED EXPORT FIXED: Server-side validation rules array
export const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ max: 255 }).withMessage('Name cannot exceed 255 characters.')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail()
];
