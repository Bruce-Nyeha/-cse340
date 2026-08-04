// src/routes.js
import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailPage, showNewOrganizationForm, processNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm, organizationValidation } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, showAssignCategoriesForm, processAssignCategoriesForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, userRegistrationValidation, userLoginValidation } from './controllers/users.js';
import { testErrorPage } from './controllers/errors.js';

// IMPORT THE AUTHENTICATION GATEWAY AND NEW VOLUNTEER HANDLERS
import { requireLogin, requireRole } from './middleware/auth.js';
import { processVolunteerSignup, processVolunteerRemoval, showDashboardPage } from './controllers/volunteers.js';

const router = express.Router();

// Publicly Accessible Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/register', showUserRegistrationForm);
router.post('/register', userRegistrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', userLoginValidation, processLoginForm);
router.get('/logout', processLogout);

//SECURED VOLUNTEER WORKSPACE ENGINES (Requires Login)
router.get('/dashboard', requireLogin, showDashboardPage);
router.get('/volunteer/:id', requireLogin, processVolunteerSignup);
router.get('/unvolunteer/:id', requireLogin, processVolunteerRemoval);

// Secured Administration Modules
router.get('/new-organization', requireLogin, showNewOrganizationForm);
router.post('/new-organization', requireLogin, organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireLogin, showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, organizationValidation, processEditOrganizationForm);
router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, showEditProjectForm);
router.post('/edit-project/:id', requireLogin, projectValidation, processEditProjectForm);
router.get('/new-category', requireLogin, showNewCategoryForm);
router.post('/new-category', requireLogin, categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, categoryValidation, processEditCategoryForm);

// Admin Role Protected Route
router.get('/assign-categories/:id', requireRole('Admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('Admin'), processAssignCategoriesForm);

router.get('/test-error', testErrorPage);

export default router;
