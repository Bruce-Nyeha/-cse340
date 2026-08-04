// src/controllers/volunteers.js
import { addVolunteer, removeVolunteer, getProjectsByVolunteer } from '../models/volunteers.js';

/**
 * Process signing up as a project volunteer
 */
export const processVolunteerSignup = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        req.flash('success', 'Thank you for volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) { next(error); }
};

/**
 * Process removing oneself as a project volunteer
 */
export const processVolunteerRemoval = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;
        const redirectPath = req.query.from === 'dashboard' ? '/dashboard' : `/project/${projectId}`;

        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have successfully removed yourself as a volunteer.');
        res.redirect(redirectPath);
    } catch (error) { next(error); }
};

/**
 * Render the User Profile Dashboard listing all signed-up projects
 */
export const showDashboardPage = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        const volunteeredProjects = await getProjectsByVolunteer(userId);
        res.render('dashboard', { title: 'Your Volunteer Dashboard', volunteeredProjects });
    } catch (error) { next(error); }
};
