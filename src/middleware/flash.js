// src/middleware/flash.js

/**
 * Custom Session Flash Middleware Module
 * Stores temporary notifications across HTTP redirects (PRG Pattern)
 * and automatically exposes them to EJS templates via res.locals.
 */
const flash = (req, res, next) => {
    // 1. Ensure the user session object partition is active
    if (!req.session) {
        return next(new Error('Flash middleware requires an active express-session configuration.'));
    }

    // 2. Initialize the flash storage array cache inside the session if missing
    if (!req.session.flashData) {
        req.session.flashData = {};
    }

    req.flash = function (type, message) {
        // CASE A: Reading and clearing messages (invoked by header.ejs)
        if (!type && !message) {
            const messages = req.session.flashData || {};
            req.session.flashData = {}; // Clear flash cache out of memory immediately
            return messages;
        }

        // CASE B: Setting a message array key pair (invoked by controllers)
        if (type && message) {
            if (!req.session.flashData[type]) {
                req.session.flashData[type] = [];
            }
            req.session.flashData[type].push(message);
            return;
        }

        // CASE C: Reading a specific type of message group
        if (type && !message) {
            const typeMessages = req.session.flashData[type] || [];
            delete req.session.flashData[type];
            return typeMessages;
        }
    };

    // 3. Expose the flash retrieval function globally to all EJS templates
    res.locals.flash = () => req.flash();

    // 4.  CRITICAL EXECUTION: Break out of the file and move to the next routing pipeline middleware!
    next();
};

export default flash;
