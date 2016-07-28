var router = require('express').Router();
var Cart = require('../models/cart');
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');
var async = require('async');

router.get('/login', function(req, res) {

    if (req.user) return res.redirect('/');

    res.render('accounts/login', { message: req.flash('loginMessage') });

});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', passportConf.isAuthenticated, function(req, res, next) {
    User.findOne({ _id: req.user._id })
        .populate('history.item')
        .exec(function(err, foundUser) {
            if (err) return next(err);

            res.render('accounts/profile', { user: foundUser });
        });
})

router.get('/signup', function(req, res, next) {
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

router.post('/signup', function(req, res, next) {

    async.waterfall([

        function(callback) {
            // get our mongoose model to create a new User
            var user = new User();

            // populate the user properties based on what the user submits
            user.profile.name = req.body.name;
            user.password = req.body.password;
            user.email = req.body.email;
            user.profile.picture = user.gravatar();

            // fetch user and test if they exist
            User.findOne({ email: req.body.email }, function(err, existingUser) {
                // check if the user already exists
                if (existingUser) {
                    // return an error message to indicate user already exists
                    req.flash('errors', 'Account with that email address already exists');
                    // redirect the user back to signup page with the error
                    return res.redirect('/signup')
                } else {
                    // save the user to the database if there is no error
                    user.save(function(err, user) {

                        if (err) return next(err);

                        callback(null, user);
                    });
                }
            });
        },
        function(user) {
            var cart = new Cart();
            cart.owner = user._id;
            cart.save(function(err) {
                if (err) return next(err);

                req.logIn(user, function(err) {

                    if (err) return next(err);

                    res.redirect('/profile');
                });

            });

        }

    ]);
});

router.get('/logout', function(req, res, next) {
    req.logout();
    return res.redirect('/');
});

router.get('/edit-profile', function(req, res, next) {
    res.render('accounts/edit-profile', { message: req.flash('success') });
});

router.post('/edit-profile', function(req, res, next) {

    User.findOne({ _id: req.user._id }, function(err, user) {

        if (err) return next(err);

        if (req.body.name) user.profile.name = req.body.name;

        if (req.body.address) user.address = req.body.address;

        user.save(function(err) {

            if (err) return next(err);

            req.flash('success', 'You have successfully edited your profile information');

            return res.redirect('/edit-profile');
        });
    });

});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

module.exports = router;
