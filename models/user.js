const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
    password: { type: String }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)