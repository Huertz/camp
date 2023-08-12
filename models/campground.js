const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//! schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//! to reduce images to thumbnails
ImageSchema.virtual('small').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
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
