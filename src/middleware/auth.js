// src/middleware/auth.js

/**
 * 1. Base Authentication Middleware
 * Checks if a user is logged in at all.
 */
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to view that resource.');
        return res.redirect('/login');
    }
    next();
};

/**
 * 2. Role Authorization Function Factory (🚀 WEEK 5 CORE CRITERION)
 * Returns a standard Express middleware function configured to validate a specific role.
 * @param {string} requiredRole - The name of the role needed (e.g., 'Admin', 'Instructor')
 */
export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        // First step: Enforce baseline login verification check
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must log in to access this page.');
            return res.redirect('/login');
        }

        const userRole = req.session.user.role_name;

        // Second step: Validate if the user's role profile matches the required access tier
        if (userRole !== requiredRole) {
            req.flash('error', `Access Denied. This resource requires the ${requiredRole} role.`);
            
            // Redirect unauthorized profiles back to the default home screen layout
            return res.redirect('/');
        }

        // Access level cleared! Move to the next controller routine
        next();
    };
};
