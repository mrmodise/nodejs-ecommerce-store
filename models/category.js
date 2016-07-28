/**
 * @author: Morebodi Modise
 * @contacts: http://github.com/mrmodise, http://mrmodise.com
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: {type: String, unique: true, lowercase: true}
});

module.exports = mongoose.model('Category', CategorySchema);