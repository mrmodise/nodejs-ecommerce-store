const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
ObjectId = Schema.Types;

const ProductSchema = new Schema({
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