const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports.getHome = (req, res) => {
    res.render('home');
};

module.exports.getSignup = (req, res) => {
    res.render('signup');
};

module.exports.getLogin = (req, res) => {
    res.render('login');
}

module.exports.getArticles = async (req, res) => {
    res.render('articles');
};