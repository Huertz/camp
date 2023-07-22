const mongoose = require('mongoose');
const Review = require('./review');
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

//? deletes review when delating a camp
CampSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Campground', CampSchema);
