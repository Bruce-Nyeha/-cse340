// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; 
import flash from './src/middleware/flash.js'; 

dotenv.config();

// Import router only after core configuration assignments
import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine template configuration properties
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Core factory assembly line assets static directory mapping
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚀 FIXED: Express Session Module Setup reading strictly from the environment
app.use(session({
    secret: process.env.SESSION_SECRET,
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
    res.locals.user = req.session.user || null;
    next();
});

// Mount application modular MVC controllers router pipeline
app.use(router);

// Centralized error middleware delegating entirely to an isolated EJS view template
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
