// external imports
const router = require('express').Router();
const async = require('async');
const faker = require('faker');
// custom imports
const Category = require('../models/category');
const Product = require('../models/product');

/**
 * Handles POST HTTP search requests
 */
router.post('/search', (req, res, next) => {
    // search a product give the product name
    Product.search({
        query_string: {query: req.body.search_term}
    }, (err, results) => {
        // oops error might occur
        if (err) return next(err);
        // return search results in JSON format
        res.json(results);
    });
});

/**
 * Handles GET HTTP requests to display products from Fake API
 */
router.get('/:name', (req, res, next) => {
    // executes array of functions in series, passing result of previous function to the next
    async.waterfall([
        // function 1
        (callback) => {
            Category.findOne({name: req.params.name}, (err, category) => {
                // oops error might occur
                if (err) return next(err);
                // return results to callback
                callback(null, category);
            });

        },
        // function 2
        (category) => {
            for (let i = 0; i < 30; i++) {
                // create a new product instance
                const product = new Product();
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