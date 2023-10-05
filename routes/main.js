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

// router.post('/auth', controller.postAuth);

router.get('/articles', controller.getArticles);

module.exports = router;