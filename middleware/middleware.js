/**
 * @author: Morebodi Modise
 * @contacts: http://github.com/mrmodise, http://mrmodise.com
 */
var Cart = require('../models/cart');

module.exports = function(req, res, next){
	if (req.user){
		var total = 0;
		Cart.findOne({owner: req.user._id}, function(err, cart){
			if(cart){
				for(var i = 0; i < cart.items.length; i++){
					total += cart.items[i].quantity;
				}
				res.locals.cart = total;
			}else{
				res.locals.cart = 0;
			}
			next();
		});
	}else{
		next();
	}
}