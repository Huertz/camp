const express = require('express');
//? helps merge params
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../middleware/middleware');
//? utils
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
//? schema setup
const Campground = require('../models/campground');
const Review = require('../models/review');
//? controllers
const reviews = require('../controllers/reviews');

//? creates review in campground
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//? deletes reviews
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

//? fancy way to restructure routes
// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// router.delete(
//   '/:reviewId',
//   isLoggedIn,
//   isReviewAuthor,
//   catchAsync(reviews.deleteReview)
// );

module.exports = router;
