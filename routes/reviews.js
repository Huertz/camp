const express = require('express');
//? helps merge params
const router = express.Router({ mergeParams: true });

//? utils
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//? schema setup
const Campground = require('../models/campground');
const Review = require('../models/review');

//? JOI back-end validation
const { reviewSchema } = require('../schemas.js');

//? middleware/backend validation for reviews
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//? creates review in campground
router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a review');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//? deletes reviews
router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
