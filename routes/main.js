// external imports
var router = require('express').Router();
var stripe = require('stripe')('pk_test_6eUlykjUkKIa4viRDPGNKjwv');
var async = require('async');

// custom imports
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');
var passportConf = require('../config/passport');

/**
 * Handles the products pagination/navigation
 * @param req
 * @param res
 * @param next
 */
function paginate(req, res, next) {
	// step through products 9 times
	var perPage = 9;
	//TODO: refactor below code further
	var page = req.params.page;
	
	Product
		.find()
		.skip(perPage * page)
		.limit(perPage)
		.populate('category')
		.exec(function (err, products) {
			if (err) return next(err);
			Product.count().exec(function (err, count) {
				if (err) return next(err);
				res.render('main/product-main', {
					products: products,
					pages: count / perPage
				});
			});
		});
}

/**
 * Handles mapping between a product in the database and elastic search
 */
Product.createMapping(function (err, mapping) {
	//TODO: add logic to inform the user of the successful mapping
	if (err) {
		console.log("Error creating mapping");
		console.log(err);
	} else {
		console.log("Mapping created");
	}
});

var stream = Product.synchronize(), count = 0;

stream.on('data', function () {
    count++;
});

stream.on('close', function () {
    console.log("Indexed " + count + " documents from Products");
});

stream.on('error', function (err) {
    console.log(err);
});

/**
 * single product search
 */
router.get('/search', function (req, res, next) {
	
	if (req.query.q) {
		Product.search({
			query_string: {query: req.query.q}
		}, function (err, results) {
			
			if (err) return next(err);
			console.log(results);
			var data = results.hits.hits.map(function (hit) {
				return hit;
			});
			console.log(data);
			res.render('main/search-result', {
				query: req.query.q,
				data: data
			});
		});
	}
});

router.post('/search', function (req, res, next) {
	res.redirect('/search?q=' + req.body.q);
});

router.post('/product/:product_id', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, cart) {
		cart.items.push({
			item: req.body.product_id,
			price: parseFloat(req.body.priceValue),
			quantity: parseInt(req.body.quantity)
		});
		
		cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
		
		cart.save(function (err) {
			if (err) return next(err);
			return res.redirect('/cart');
		})
		
	});
	
});

router.get('/cart', passportConf.isAuthenticated, function (req, res, next) {
	Cart
		.findOne({owner: req.user._id})
		.populate('items.item')
		.exec(function (err, foundCart) {
			if (err) return next(err);
			
			res.render('main/cart', {
				foundCart: foundCart,
				message: req.flash('remove')
			});
		});
});

router.post('/remove', passportConf.isAuthenticated, function (req, res, next) {
	Cart.findOne({owner: req.user._id}, function (err, foundCart) {
		foundCart.items.pull(String(req.body.item));
		
		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
		
		foundCart.save(function (err, found) {
			if (err) return next(err);
			
			req.flash('remove', 'Successfully removed the product');
			res.redirect('/cart');
		});
	});
});

router.get('/', function (req, res, next) {
	if (req.user) {
		paginate(req, res, next);
	} else {
		res.render('main/home');
	}
});

router.get('/page/:page', function (req, res, next) {
	paginate(req, res, next);
	
})

router.get('/about', function (req, res) {
	res.render('main/about');
});

router.get('/users', function (req, res) {
	User.find({}, function (err, users) {
		res.json(users);
	})
});

// return products based on category
router.get('/products/:id', function (req, res, next) {
	Product
		.find({category: req.params.id})
		.populate('category')
		.exec(function (err, products) {
			if (err) return next(err);
			
			res.render('main/category', {
				products: products
			});
		});
});

// find one product and return it for single product view
router.get('/product/:id', function (req, res, next) {
	console.log(req.params.id);
	Product.findById({_id: req.params.id}, function (err, product) {
		
		if (err) return next(err);
		
		res.render('main/product', {
			product: product
		});
	});
});


router.post('/payment', function (req, res, next) {
	
	var stripeToken = req.body.stripeToken;
	
	var currentCharges = Math.round(req.body.stripeMoney * 100);
	
	stripe.customers.create({
		source: stripeToken,
	}).then(function (customer) {
		return stripe.charges.create({
			amount: currentCharges,
			currency: 'usd',
			customer: customer.id
		});
	}).then(function (charge) {
		async.waterfall([
			function (callback) {
				Cart.findOne({owner: req.user._id}, function (err, cart) {
					callback(err, cart);
				});
			},
			function (cart, callback) {
				User.findOne({_id: req.user._id}, function (err, user) {
					if (user) {
						for (var i = 0; i < cart.items.length; i++) {
							user.history.push({
								item: cart.items[i].item,
								paid: cart.items[i].price
							});
						}
						user.save(function (err, user) {
							if (err) return next(err);
							callback(err, user);
						});
					}
				});
				
			},
			function (user) {
				Cart.update({owner: user._id}, {$set: {items: [], total: 0}}, function (err, updated) {
					if (updated) {
						res.redirect('/profile');
					}
				});
			}]);
	});
});

module.exports = router;
