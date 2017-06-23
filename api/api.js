// external imports
var router = require('express').Router();
var async = require('async');
var faker = require('faker');

// custom imports
var Category = require('../models/category');
var Product = require('../models/product');

/**
 * Handles POST HTTP search requests
 */
router.post('/search', function (req, res, next) {
	//TODO: remove this
	console.log(req.body.search_term);
	// search a product give the product name
	Product.search({
		query_string: {query: req.body.search_term}
	}, function (err, results) {
		// oops error might occur
		if (err) return next(err);
		// return search results in JSON format
		res.json(results);
	});
});

/**
 * Handles GET HTTP requests to display products from Fake API
 */
router.get('/:name', function (req, res, next) {
	// executes array of functions in series, passing result of previous function to the next
	async.waterfall([
		// function 1
		function (callback) {
			Category.findOne({name: req.params.name}, function (err, category) {
				// oops error might occur
				if (err) return next(err);
				// return results to callback
				callback(null, category);
			});
			
		},
		// function 2
		function (category) {
			for (var i = 0; i < 30; i++) {
				// create a new product instance
				var product = new Product();
				// set product properties using faker API
				product.category = category._id;
				product.name = faker.commerce.productName();
				product.price = faker.commerce.price();
				product.image = faker.image.image();
				product.save();
			}
		}
	]);
	// return success message in JSON format
	res.json({message: 'Success'});
});

module.exports = router;