const User = require('../models/user');
const plugins = require('./plugins');

// isLoggedIn Middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "Please sign in first.");
        return res.redirect('/login');
    }
    next();
};

// notLoggedIn Middleware
module.exports.notLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('Please sign out to view page.');
        return res.redirect('/dashboard');
    } else {
        next();
    };
};


module.exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.isValidId = async (req, res, next) => {
    console.log(typeof req.params.id, req.url);
    if (await plugins.validObjectId(req.params.id)) {
        next();
    } else {
        req.flash('error', 'Invalid request.');
        res.redirect('back');
    }
};

module.exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};