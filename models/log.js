const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['shower', 'toilet', 'laundry', 'dishwasher', 'gardening'] },
    shower: {
        freq: { type: Number, required: true },
        avgTime: { type: Number, required: true },
    },
    toilet: {
        freq: { type: Number, required: true },
    },
    laundry: {
        freq: { type: Number, required: true },
        load: { type: Number, required: true },
    },
    dishwasher: {
        freq: { type: Number, required: true },
        size: { type: Number, required: true },
    },
    date: { type: Date, required: true },
    notes: { type: String, required: true }
});

module.exports = mongoose.model('Habit', habitSchema);