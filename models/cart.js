/**
 * @author: Morebodi Modise
 * @contacts: http://github.com/mrmodise, http://mrmodise.com
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	total: {type: Number, default: 0},
	items: [{
		item: {type: Schema.Types.ObjectId, ref: 'Product'},
		quantity: {type: Number, default: 1},
		price: {type: Number, default: 0}
	}]
});

module.exports = mongoose.model('Cart', CartSchema);