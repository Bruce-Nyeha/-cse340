import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

const router = express.Router();

router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailPage); 

// Projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailPage); 

// Categories routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;
