const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    zipCode: { type: Number, required: true },
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
    password: { type: String }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', userSchema);