
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine token setup properties configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Core factory assembly line assets middleware registration blocks
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(router);


app.use((err, req, res, next) => {
    console.error('Captured application error event stream:', err.message);
    res.status(err.status || 500).render('error', { 
        title: 'Error Encountered', 
        message: err.message || 'Something went wrong on our end!' 
    });
});

app.listen(port, () => {
    console.log(`  Server running securely in ${process.env.NODE_ENV || 'development'} mode at http://localhost:${port}`);
});
