const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true },
});

module.exports = mongoose.model("Category", CategorySchema);
