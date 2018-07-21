// external imports
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

// custom imports
const cartLength = require('./middleware/middleware');
const secret = require('./config/secret');
const User = require('./models/user');
const Category = require('./models/category');

// get routes
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./api/api');

// initialize express
const app = express();

// connect node to mongodb
mongoose.connect(secret.database, (err) => {
    if (err) {
        console.log('Make sure the database server is running ' + err);
    } else {
        console.log('Connected to the database');
    }
}, {useNewUrlParser: true});

//middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true})
}));

app.use(flash());
// set the view
app.engine('ejs', engine);
app.set('view engine', 'ejs');
// make use of our passport module
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // assign each route the user object
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    /* search for all categories */
    Category.find({}, (err, categories) => {
        /*if there is an error return it */
        if (err) return next(err);

        res.locals.categories = categories;

        next();
    });
});

app.use(cartLength);

// make use of the routes
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);
app.use(errorRoutes);

app.get('/*', (req, res, next) => {
    if (typeof req.cookies['connect.sid'] !== 'undefined') {
        console.log(req.cookies['connect.sid']);
    }
});

// configure the server's listen port and give user feedback
app.listen(secret.port, (err) => {
    if (err) throw err;
    console.log('Go to http://localhost:' + secret.port + ' in your browser');
});