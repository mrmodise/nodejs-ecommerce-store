var router = require('express').Router();

// handle the 404 error
router.use(function(req, res, next){
	// // res.redirect('/error');
	// var err = new Error('Page not found');
	// err.status = 404;
	// next(err);
	res.render('main/error', {
		errors: 'Oops! The page you\'re looking for does not exist in this server'
	});

});

module.exports = router;