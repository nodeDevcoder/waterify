const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const Log = require('../models/log');
const plugins = require('../config/plugins');

module.exports.getHome = (req, res) => {
    // let x = [
    //     {
    //         shower: { freq: 2, avgTime: 23 },
    //         toilet: { freq: 4 },
    //         laundry: { freq: 2, load: 'sm' },
    //         dishwasher: { freq: 2 },
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-25T02:28:02.629Z"),
    //         zipCode: 95391,
    //         notes: 'Some notes here..',
    //         __v: 0,
    //         score: 143
    //     },
    //     {
    //         shower: { freq: 4, avgTime: 21 },
    //         toilet: { freq: 6 },
    //         laundry: { freq: 5, load: 'sm' },
    //         dishwasher: { freq: 1 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-25T02:39:04.173Z"),
    //         notes: 'Some extra notes lol.',
    //         __v: 0,
    //         score: 272
    //     },
    //     {
    //         shower: { freq: 3, avgTime: 25 },
    //         toilet: { freq: 9 },
    //         laundry: { freq: 1, load: 'sm' },
    //         dishwasher: { freq: 2 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-25T17:55:38.337Z"),
    //         notes: 'Mughal smelly',
    //         __v: 0,
    //         score: 215.5
    //     },
    //     {
    //         shower: { freq: 3, avgTime: 8 },
    //         toilet: { freq: 8 },
    //         laundry: { freq: 4, load: 'sm' },
    //         dishwasher: { freq: 3 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-26T17:31:54.769Z"),
    //         notes: 'Ayaan...',
    //         __v: 0,
    //         score: 116
    //     },
    //     {
    //         shower: { freq: 3, avgTime: 8 },
    //         toilet: { freq: 6 },
    //         laundry: { freq: 1, load: 'sm' },
    //         dishwasher: { freq: 2 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-29T05:18:55.691Z"),
    //         notes: 'Lol',
    //         __v: 0,
    //         score: 82
    //     },
    //     {
    //         shower: { freq: 3, avgTime: 2 },
    //         toilet: { freq: 4 },
    //         laundry: { freq: 2, load: 'sm' },
    //         dishwasher: { freq: 2 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-29T19:50:35.348Z"),
    //         notes: 'Lol',
    //         __v: 0,
    //         score: 43
    //     },
    //     {
    //         shower: { freq: 2, avgTime: 8 },
    //         toilet: { freq: 4 },
    //         laundry: { freq: 1, load: 'lg' },
    //         dishwasher: { freq: 2 },
    //         zipCode: 95391,
    //         user: "65428825e07a072a70a9c4a6",
    //         date: new Date("2023-10-30T15:52:46.757Z"),
    //         notes: 'Hello',
    //         score: 68,
    //         __v: 0
    //     }
    // ];
    // x.forEach(async el => {
    //     await Log.create(el);
    // });
    res.render('home');
};

module.exports.getSignup = (req, res) => {
    res.render('signup');
};

module.exports.getLogin = (req, res) => {
    res.render('login');
};

module.exports.postSignup = async (req, res) => {
    try {
        let { email, firstName, lastName, password, zipCode } = req.body;
        email = email.toLowerCase();
        firstName = firstName.trim();
        lastName = lastName.trim();
        await plugins.checkEmail(email).catch(err => {
            throw new Error(err.message);
        });
        firstName = await plugins.checkName(firstName).catch(err => {
            throw new Error(err.message);
        });
        firstName = plugins.capitalize(firstName);
        lastName = await plugins.checkName(lastName).catch(err => {
            throw new Error(err.message);
        });
        lastName = plugins.capitalize(lastName);
        await plugins.checkPassword(password).catch(err => {
            throw new Error(err.message);
        });
        const user = new User({ firstName, lastName, email, zipCode });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};

module.exports.postLogin = async (req, res) => {
    const redirectUrl = req.session.redirectTo || '/dashboard';
    await delete req.session.redirectTo;
    res.redirect(redirectUrl);
};

module.exports.getArticles = async (req, res) => {
    res.render('articles');
};

module.exports.getNewLog = async (req, res) => {
    let date = new Date(Date.now());
    let logExists = await Log.find({ user: req.user._id });
    let errs = 0;
    for (let log of logExists) {
        if (log.date.getFullYear() === date.getFullYear() && log.date.getMonth() === date.getMonth() && log.date.getDate() === date.getDate()) {
            req.flash('warning', 'An existing log for this date already exists.');
            return res.redirect(`/logs/${log._id}/edit`);
        }
    }
    res.render('newLog');
};

module.exports.postNewLog = async (req, res) => {
    try {
        let cDate = new Date(Date.now());
        let logExists = await Log.find({ user: req.user._id });
        for (let log of logExists) {
            if (log.date.getFullYear() === cDate.getFullYear() && log.date.getMonth() === cDate.getMonth() && log.date.getDate() === cDate.getDate()) {
                req.flash('warning', 'An existing log for this date already exists.');
                return res.redirect(`/logs/${log._id}/edit`);
            }
        }
        let { showerFreq, showerAvg, toiletFreq, laundryFreq, laundryLoad, dishFreq, notes } = req.body;
        if (Number(showerFreq) < 0 || Number(showerFreq) > 9) {
            throw new Error('Number of showers must be less than 10.');
        }
        if (Number(showerAvg) < 0 || Number(showerAvg) > 60) {
            throw new Error('Shower average time must be between 0 and 60.');
        }
        if (Number(toiletFreq) < 0) {
            throw new Error('Number of toilet visits cannot be negative.');
        }
        if (laundryLoad && !laundryFreq) {
            throw new Error('Please select the # of laundry loads.');
        }
        showerFreq = Number(showerFreq);
        showerAvg = Number(showerAvg);
        toiletFreq = Number(toiletFreq);
        if (laundryFreq === 0) {
            laundryLoad = null;
        }
        if (!['sm', 'md', 'lg', 'xl'].includes(laundryLoad)) {
            laundryLoad = null;
            laundryFreq = 0;
        }
        laundryFreq = Number(laundryFreq) || 0;
        dishFreq = Number(dishFreq) || 0;
        let user = req.user._id;
        let date = new Date(Date.now());
        let log = new Log({ shower: { freq: showerFreq, avgTime: showerAvg }, zipCode: req.user.zipCode, toilet: { freq: toiletFreq }, laundry: { freq: laundryFreq, load: laundryLoad }, dishwasher: { freq: dishFreq }, notes, date, user });
        await log.save();
        console.log(log);
        req.flash('success', 'Added new log!');
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/dashboard');
    }
};

module.exports.getDashboard = async (req, res) => {
    let logs = await Log.find({ user: req.user }).sort({ 'date': -1 });
    let rnLog = await Log.find({ date: { $gte: new Date(Date.now()).setHours(0, 0, 0, 0) } });
    if (!rnLog) {
        req.flash('warning', 'You haven\'t logged today!')
    }
    res.render('dashboard', { logs });
};

module.exports.getEditLog = async (req, res) => {
    try {
        if (!plugins.validObjectId(req.params.id)) {
            throw new Error('Invalid request.');
        }
        let log = await Log.findById(req.params.id);
        res.render('editLog', { log });
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/dashboard');
    }
};

module.exports.postEditLog = async (req, res) => {
    try {
        if (!plugins.validObjectId(req.params.id)) {
            throw new Error('Invalid request.');
        }
        let { showerFreq, showerAvg, toiletFreq, laundryFreq, laundryLoad, dishFreq, notes } = req.body;
        let log = await Log.findById(req.params.id);
        if (Number(showerFreq) < 0 || Number(showerFreq) > 9) {
            throw new Error('Number of showers must be less than 10.');
        }
        if (Number(showerAvg) < 0 || Number(showerAvg) > 60) {
            throw new Error('Shower average time must be between 0 and 60.');
        }
        if (Number(toiletFreq) < 0) {
            throw new Error('Number of toilet visits cannot be negative.');
        }
        if (laundryLoad && !laundryFreq) {
            throw new Error('Please select the # of laundry loads.');
        }
        showerFreq = Number(showerFreq);
        showerAvg = Number(showerAvg);
        toiletFreq = Number(toiletFreq);
        if (laundryFreq === 0) {
            laundryLoad = null;
        }
        if (!['sm', 'md', 'lg', 'xl'].includes(laundryLoad)) {
            laundryLoad = null;
            laundryFreq = 0;
        }
        laundryFreq = Number(laundryFreq) || 0;
        dishFreq = Number(dishFreq) || 0;
        let user = req.user._id;
        log.shower = { freq: showerFreq, avgTime: showerAvg };
        log.toilet = { freq: toiletFreq };
        log.laundry = { freq: laundryFreq, load: laundryLoad };
        log.dishwasher = { freq: dishFreq };
        log.notes = notes;
        await log.save();
        req.flash('success', 'Updated log!');
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/dashboard');
    }
};

module.exports.getLeaderboard = async (req, res) => {
    const curr = new Date(); // get current date
    const first = new Date(curr);
    first.setDate(curr.getDate() - curr.getDay());
    first.setHours(0, 0, 0, 0);
    await Log.find({ zipCode: req.user.zipCode, date: { $gte: first } }).catch(err => { console.log(err); }).then(async logs => {
        let userValues = {};
        for (let log of logs) {
            if (userValues[log.user._id]) {
                userValues[log.user._id].miniscore += log.score;
                userValues[log.user._id].num += 1;
            } else {
                userValues[log.user._id] = { miniscore: log.score, num: 1 };
            }
        }
        let leaderboard = {};
        for (let [key, value] of Object.entries(userValues)) {
            leaderboard[key] = value.miniscore / value.num; // avg
        }
        let keys = Object.keys(leaderboard);
        keys.sort((a, b) => leaderboard[a] - leaderboard[b]);
        let ldrbrd = [];
        for (let [key, value] of Object.entries(leaderboard)) {
            let user = await User.findById(key);
            ldrbrd.push({ user, score: Math.round(value * 100) / 100 });
        }
        res.render('leaderboard', { leaderboard: ldrbrd });
    });
};

module.exports.about = (req, res) => {
    res.render('about')
}

module.exports.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
};