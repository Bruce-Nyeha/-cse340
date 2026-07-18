import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId } from '../models/organizations.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        
        // Render your clean EJS view grid
        res.render('organizations', { title, organizations });
    } catch (error) {
        // CRITICAL FIX: Pushes the database crash down to the error page instead of hanging!
        next(error); 
    }
};


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
