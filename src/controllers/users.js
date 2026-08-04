// src/controllers/users.js
import bcrypt from 'bcryptjs';
import { validationResult, body } from 'express-validator'; 
import { createUser, authenticateUser, getAllUsersWithRoles } from '../models/users.js';

/**
 * 1. Render the Registration form view page
 */
export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register Account' });
};

/**
 * 2. Process Registration payload data and encrypt password strings
 */
export const processUserRegistrationForm = async (req, res, next) => {
    // RUN BACKEND INPUT VALIDATION CHECKS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash('error', e.msg));
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

/**
 * 3. Render the Account Login form view page
 */
export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

/**
 * 4. Process Account Login form validation and initialize user session state
 */
export const processLoginForm = async (req, res, next) => {
    //  RUN BACKEND INPUT VALIDATION CHECKS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash('error', e.msg));
        return res.redirect('/login');
    }

    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            res.redirect('/');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login verification process:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

/**
 * 5. Terminate user session and remove object memory markers on logout
 */
export const processLogout = async (req, res, next) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

//  EXPORT THE CRITICAL INPUT SANITIZATION MATRICES (Used in routes.js next)
export const userRegistrationValidation = [
    body('name').trim().notEmpty().withMessage('Full name is required.').escape(),
    body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

export const userLoginValidation = [
    body('email').trim().isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password field cannot be blank.')
];


export const showUsersDirectoryPage = async (req, res, next) => {
    try {
        const systemUsers = await getAllUsersWithRoles();
        res.render('users', { title: 'System User Directory', systemUsers });
    } catch (error) {
        next(error);
    }
};