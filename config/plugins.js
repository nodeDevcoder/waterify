const mongoose = require('mongoose');
const User = require('../models/user');

// Capitalize words
module.exports.capitalize = (word) => {
    if (typeof word !== 'string') return word;
    word = word.toLowerCase();
    return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
};

module.exports.checkName = (name) => {
    return new Promise((resolve, reject) => {
        const regex = /^[A-Za-z]+$/;
        if (!regex.test(name)) {
            reject('Invalid name.');
        } else {
            resolve(name.trim());
        }
    });
};

module.exports.checkUsername = (username) => {
    return new Promise((resolve, reject) => {
        const regex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$/;
        if (!regex.test(username)) {
            reject('Username is invalid.');
        } else {
            resolve();
        }
    });
};

module.exports.checkPassword = async (password) => {
    return new Promise((resolve, reject) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-=_+]{8,}$/;
        if (!passwordRegex.test(password)) {
            reject('Password is not valid.');
        } else {
            resolve();
        }
    });
};

module.exports.checkEmail = async (email) => {
    let regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
    return new Promise((resolve, reject) => {
        if (!regex.test(email)) {
            reject('Please check your email.')
        } else {
            resolve()
        }
    })
};

module.exports.checkUsernameExists = async (model, username) => {
    return await mongoose.model(model).findOne({ username });
};

module.exports.checkEmailExists = async (model, email) => {
    return await mongoose.model(model).findOne({ email });
};

module.exports.validObjectId = async (id) => {
    if (typeof id !== 'string') {
        return false;
    }
    if (mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id) == id) {
        return true;
    } else return false;
};