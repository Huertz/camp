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

const opts = { toJSON: { virtuals: true } };

const CampSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

CampSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong> <a href="/campgrounds/${this._id}">${this.title}</a></strong`;
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
