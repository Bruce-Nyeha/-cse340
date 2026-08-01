// src/routes.js
import express from 'express';
import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    showEditOrganizationForm, 
    processEditOrganizationForm, 
    organizationValidation 
} from './controllers/organizations.js';

import { 
    showProjectsPage, 
    showProjectDetailPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm, 
    processEditProjectForm, 
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    projectValidation 
} from './controllers/projects.js';

import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm, 
    categoryValidation 
} from './controllers/categories.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    userRegistrationValidation, 
    userLoginValidation,
    processLogout
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

// IMPORT THE AUTHENTICATION AND AUTHORIZATION PROTECTION GATES
import { requireLogin, requireRole } from './middleware/auth.js';

const router = express.Router();

// Publicly Accessible Base Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Publicly Accessible Authentication Gateways
router.get('/register', showUserRegistrationForm);
//  Injected userRegistrationValidation to block invalid inputs
router.post('/register', userRegistrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
//  Injected userLoginValidation to block blank inputs
router.post('/login', userLoginValidation, processLoginForm);
router.get('/logout', processLogout);

// SECURED ORGANIZATIONS ROUTES (Requires baseline authentication)
router.get('/new-organization', requireLogin, showNewOrganizationForm);
router.post('/new-organization', requireLogin, organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireLogin, showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, organizationValidation, processEditOrganizationForm);

// SECURED PROJECTS ROUTES (Requires baseline authentication)
router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, showEditProjectForm);
router.post('/edit-project/:id', requireLogin, projectValidation, processEditProjectForm);

// CRITICAL PRIVILEGED ROUTES (Strictly restricted to Admin profiles using the factory wrapper)
router.get('/assign-categories/:id', requireRole('Admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('Admin'), processAssignCategoriesForm);

// SECURED CATEGORIES ROUTES (Requires baseline authentication)
router.get('/new-category', requireLogin, showNewCategoryForm);
router.post('/new-category', requireLogin, categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, categoryValidation, processEditCategoryForm);

router.get('/test-error', testErrorPage);

export default router;
