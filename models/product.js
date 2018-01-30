var mongoose = require('mongoose')
require('mongoose-long')(mongoose);
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
ObjectId = Schema.Types;

var ProductSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    name: String,
    price: String,
    image: String
});

ProductSchema.plugin(mongoosastic, {
    hosts: ['localhost:9200']
});

module.exports = mongoose.model('Product', ProductSchema);