// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Now your database configuration pool can safely read process.env.DB_URL
import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine template configuration properties
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Core factory assembly line assets middleware registration blocks
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global middleware to pass environment data cleanly to all EJS templates (e.g. footer.ejs)
app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    next();
});

// Mount your modular application MVC routes
app.use(router);

// Centralized error-handling middleware that uses pure structural HTML text
app.use((err, req, res, next) => {
    console.error('Captured application error event stream:', err.message);
    res.status(err.status || 500).send(`
        <div class="error-container" style="font-family: system-ui, sans-serif; max-width: 600px; margin: 4rem auto; text-align: center;">
            <h1 class="error-heading" style="color: #dc2626; font-size: 2rem; font-weight: 700;">Error Encountered</h1>
            <p class="error-message" style="color: #4b5563; font-size: 1.1rem; margin-top: 0.5rem;">${err.message || 'Something went wrong on our end!'}</p>
            <a href="/" class="error-home-link" style="display: inline-block; margin-top: 1.5rem; color: #1e3a8a; font-weight: 600; text-override: none; text-decoration: none;">Return Home</a>
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Server running securely in ${process.env.NODE_ENV || 'development'} mode at http://localhost:${port}`);
});
