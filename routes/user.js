// external imports
const router = require('express').Router();
const passport = require('passport');
const async = require('async');

// custom imports
const Cart = require('../models/cart');
const User = require('../models/user');
const passportConf = require('../config/passport');

/**
 *  Handles GET HTTP requests for user login
 */
router.get('/login', (req, res) => {
    // if user exists, then they have been logged in redirect to home page
    if (req.user) return res.redirect('/');
    // user was not logged in, show error message (No user with such credentials found)
    res.render('accounts/login', {message: req.flash('loginMessage')});
});

/**
 * Handles POST HTTP requests for user login - form submission
 */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

/**
 * Handles GET HTTP requests for user profile
 */
router.get('/profile', passportConf.isAuthenticated, (req, res, next) => {
    // search for a single user given the user ID
    User.findOne({_id: req.user._id})
        .populate('history.item')
        .exec((err, foundUser) => {
            if (err) return next(err); // oops error might occur
            res.render('accounts/profile', {user: foundUser}); // user found, render the profile view
        });
});

/**
 * Handles GET HTTP requests for user sign-up
 */
router.get('/signup', (req, res, next) => {
    // user sign-up failed, show error message
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

/**
 * Handles POST HTTP request for user sign-up
 */
router.post('/signup', (req, res, next) => {
    // executes array of functions in series, passing result of previous function to the next
    async.waterfall([
        // function 1
        (callback) => {
            // create new user model
            let user = new User();
            // populate the user properties based on what the user submitted
            user.profile.name = req.body.name;
            user.name = req.body.name;
            user.password = req.body.password;
            user.email = req.body.email;
            user.profile.picture = user.gravatar();

            // check submitted email against the database
            User.findOne({email: req.body.email}, (err, existingUser) => {
                // does the user already exist?
                if (existingUser) {
                    // return an error message to indicate user already exists
                    req.flash('errors', 'Account with that email address already exists');
                    // redirect the user back to signup page with the error
                    return res.redirect('/signup')
                } else {
                    // save the user to the database if there is no error
                    user.save((err, user) => {
                        // oops error might occur
                        if (err) return next(err);
                        // success set user to the callback
                        callback(null, user);
                    });
                }
            });
        },
        // function 2 - receives result of function 1, see line 83 above
        (user) => {
            // create a new cart model
            const cart = new Cart();
            // set cart owner as the current user
            cart.owner = user._id;
            // save cart to mongo
            cart.save((err) => {
                // oops error might occur
                if (err) return next(err);
                // log user in
                req.logIn(user, (err) => {
                    // error occurred
                    if (err) return next(err);
                    // sucess, redirect user to their profile page
                    res.redirect('/profile');
                });
            });
        }
    ]);
});

/**
 * Handles GET HTTP requests for user logout
 */
router.get('/logout', (req, res, next) => {
    // terminate existing login session
    req.logout();
    // send user back to the home/landing page
    return res.redirect('/');
});

/**
 * Handles GET HTTP requests for editing user profile
 */
router.get('/edit-profile', (req, res, next) => {
    // load the edit profile view
    res.render('accounts/edit-profile', {message: req.flash('success')});
});

/**
 * Handles POST HTTP requests for editing user profile
 */
router.post('/edit-profile', (req, res, next) => {
    // check submitted user id against the database
    User.findOne({_id: req.user._id}, (err, user) => {
        // error occurred
        if (err) return next(err);
        // success - update user's name
        if (req.body.name) user.profile.name = req.body.name;
        // update user address
        if (req.body.address) user.address = req.body.address;
        // save the newly updated user details
        user.save((err) => {
            // oops error might occur
            if (err) return next(err);
            // success - render success notification
            req.flash('success', 'You have successfully edited your profile information');
            // redirect user to the edit profile view
            return res.redirect('/edit-profile');
        });
    });

});

/**
 * Handle GET HTTP requests from Facebook authentication
 */
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

/**
 * Handles GET HTTP results from Facebook authentication
 */
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

// make route accessible to other files
module.exports = router;
