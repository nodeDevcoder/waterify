if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const main = require('./routes/main');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(morgan('combined'));

mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/congressional')
    .then(() => console.log('Connected to DB!'))
    .catch((error) => console.log(error.message));

app.use(session({
    name: 'waterify-session',
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        name: 'waterify-auth',
        maxAge: 24000 * 60 * 60 * 14, // 14 days
        secure: 'auto'
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/congressional'
    })
})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.companyName = 'Waterify';
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.success = req.flash('success');
    res.locals.protocol = req.protocol;
    res.locals.hostURL = req.get('host');
    next();
});

mongoose.set('sanitizeFilter', true);
app.use(bodyParser.json());

app.use(main);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Server is listening on port", port);
});