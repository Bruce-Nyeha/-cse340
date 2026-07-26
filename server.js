// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; 
import flash from './src/middleware/flash.js'; 

dotenv.config();

import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine template configuration properties
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Core static assets directory pipeline mapping
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Module Middleware Setup with Fallback Token
app.use(session({
    secret: process.env.SESSION_SECRET || 'bruce_nyeha_ultimate_secure_backup_session_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 3600000 
    }
}));

// Mount global session-based notification flash arrays
app.use(flash);

// Global middleware to pass environment variables cleanly to templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    next();
});

// Mount application modular MVC controllers router pipeline
app.use(router);

// 🚀 FIXED: Centralized error middleware now delegates entirely to an isolated EJS view template!
app.use((err, req, res, next) => {
    console.error('Captured application error event stream:', err.message);
    
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Something went wrong on our end!';
    
    res.status(statusCode).render('error', { 
        title: 'Error Encountered', 
        status: statusCode, 
        message: errorMessage 
    });
});

app.listen(port, () => {
    console.log(`Server running securely in ${process.env.NODE_ENV || 'development'} mode at http://localhost:${port}`);
});
