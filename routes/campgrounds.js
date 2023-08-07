const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../middleware/middleware');

const Campground = require('../models/campground');

//! show a campgrounds
router.get('/', catchAsync(campgrounds.index));

//! order does matter
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//? old way of implementing erros
//! creates campground
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

//! camp by id
router.get('/:id', catchAsync(campgrounds.showCampground));

//! edit camp by id
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//! updates camp by id
//! can also used patch
router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

//! deletes camp by id for now..
router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground));

module.exports = router;
