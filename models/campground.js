const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//! schema
const CampSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampSchema);
