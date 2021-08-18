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
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimitter.js')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const hpp = require('hpp');
const toobusy = require('toobusy-js');
const cpuPercentage = require('./middleware/cpuUsage');


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












//Security Middleware for backend infrastructure

app.use(
    helmet.frameguard(),
    helmet.hsts(),
    helmet.noSniff(),
    helmet.dnsPrefetchControl(),
    helmet.ieNoOpen(),
    helmet.referrerPolicy(),
    helmet.xssFilter(),
    helmet.hidePoweredBy()
)
// Rate limitter for DDOS attacks
app.use(rateLimit());

// Checks whether request size is greater than the permitter value (default added value 2 kb)
// If request size is greater than 2kb rejects the request
app.use(function (req, res, next) {
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    next()
    return
  }

  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb', 
    encoding: contentType.parse(req).parameters.charset
  }, function (err, string) {
    if (err) return next(err)
    req.text = string
    next()
  })
})
//Server Overload Notifier 
app.use(function(req, res, next) {
    if (toobusy()) {
        // log if you see necessary
        console.log(cpuPercentage());
        res.send(503, "Server Too Busy");
    } else {
    next();
    }
});

//Prevent HTTP Parameter Pollution
app.use(hpp());








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