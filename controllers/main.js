const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports.getHome = (req, res) => {
    res.render('home');
};

module.exports.getAuth = (req, res) => {
    res.render('auth');
};

module.exports.getArticles = async (req, res) => {
    res.render('articles');
};