// needed for local authentication
var passport = require('passport');

// needed for local login
var LocalStrategy = require('passport-local').Strategy;

// needed for facebook authentication
var FacebookStrategy = require('passport-facebook').Strategy;

var secret = require('../config/secret');

var User = require('../models/user');

var async = require('async');

var Cart = require('../models/cart');


// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// give the middleware a name, and create a new anonymous instance of LocalStrategy
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // find a specific email
    User.findOne({ email: email }, function(err, user) {
        // incase of an error return a callback
        if (err) return done(err);

        if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user with such credentials found'));
        }

        // compare user provided password and the database one
        if (!user.comparePassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong credentials'));
        }

        // return user object
        return done(null, user);

    });
}));

passport.use(new FacebookStrategy(secret.facebook, function(token, refreshToken, profile, done) {
    
    User.findOne({ facebook: profile.id }, function(err, user) {
        if (err) return next(err);

        if (user) {
            return done(null, user);
        } else {
            async.waterfall([
                function(callback) {
                    var newUser = new User();
                    newUser.email = profile._json.email;
                    newUser.facebook = profile.id;
                    newUser.tokens.push({ kind: 'facebook', token: token });
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

                    newUser.save(function(err) {
                        if (err) return next(err);
                        callback(err, newUser._id);
                    })

                },
                function(newUser) {
                    var cart = new Cart();

                    cart.owner = newUser._id;
                    cart.save(function(err) {
                        if (err) return done(err);
                        return done(err, newUser);

                    });
                }
            ]);

        }
    });
}));

// custom function validate
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');

};
