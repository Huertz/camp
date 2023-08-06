const express = require('express');
//? helps merge params
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require('../middleware/middleware');
//? utils
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//? schema setup
const Campground = require('../models/campground');
const Review = require('../models/review');

//? creates review in campground
router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
