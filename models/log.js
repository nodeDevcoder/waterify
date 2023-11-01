const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    shower: {
        freq: { type: Number, required: true },
        avgTime: { type: Number, required: true },
    },
    toilet: {
        freq: { type: Number, required: true },
    },
    laundry: {
        freq: { type: Number, required: true },
        load: { type: String, enum: ['sm', 'md', 'lg', 'xl', null] },
    },
    dishwasher: {
        freq: { type: Number, required: true },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    zipCode: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    score: { type: Number }
});

logSchema.pre('save', function (next) {
    let laundryInf = { 'sm': 10, 'md': 14, 'lg': 20, 'xl': 22 };
    this.score = Math.round(((this.shower.freq * this.shower.avgTime * 2.5) + (this.toilet.freq * 2) + (this.laundry.freq * laundryInf[this.laundry.load])) * 100) / 100;
    next();
});

module.exports = mongoose.model('Log', logSchema);