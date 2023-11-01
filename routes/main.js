const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/main');
const passport = require('passport');
const middleware = require('../config/middleware');
const plugins = require('../config/plugins');
const User = require('../models/user');

router.get('/', controller.getHome);

router.get('/signup', controller.getSignup);

router.get('/login', controller.getLogin);

router.get('/articles', controller.getArticles);

router.get('/dashboard', controller.getDashboard);

router.post('/signup', controller.postSignup);

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    failureMessage: 'Invalid credentials.',
    keepSessionInfo: true
}), controller.postLogin);

router.get('/logout', controller.logout);

router.get('/about', controller.about)

router.get('/logs/new', middleware.isLoggedIn, controller.getNewLog);

router.post('/logs/new', middleware.isLoggedIn, controller.postNewLog);

router.get('/logs/:id/edit', middleware.isLoggedIn, controller.getEditLog);

router.post('/logs/:id/edit', middleware.isLoggedIn, controller.postEditLog);

router.get('/leaderboard', middleware.isLoggedIn, controller.getLeaderboard);

module.exports = router;