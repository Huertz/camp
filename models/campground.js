const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//! schema
const CampSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  //? ref if from the review model
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Campground', CampSchema);
