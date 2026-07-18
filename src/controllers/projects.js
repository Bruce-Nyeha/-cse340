import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};  

export const showProjectDetailPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        // Fetch the category tags for this specific project
        const categories = await getCategoriesByProjectId(projectId);
        
        res.render('project-details', { 
            title: project.title, 
            project, 
            categories 
        });
    } catch (error) {
        next(error);
    }
};


// Export any controller functions
export { showProjectsPage};
