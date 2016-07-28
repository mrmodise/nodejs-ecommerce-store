/**
 * @author: Morebodi Modise
 * @contacts: http://github.com/mrmodise, http://mrmodise.com
 */
var mongoose = require('mongoose')
	require('mongoose-long')(mongoose);
var elasticsearch = require('elasticsearch');

var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

var ProductSchema = new Schema({
	category: {type: Schema.Types.ObjectId, ref: 'Category'},
	name: String,
	price: {
		type: String
	},
	image: String
});

ProductSchema.plugin(mongoosastic, {
	hosts: ['localhost:9200']
});

module.exports = mongoose.model('Product', ProductSchema);