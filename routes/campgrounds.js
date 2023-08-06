const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../middleware/middleware');

const Campground = require('../models/campground');

//! middlewere/backend validatation for camps

//! show a campgrounds
router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

//! order does matter
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//? old way of implementing erros
//! creates campground
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //! redirect mostly used in POST
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//! camp by id
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

//! edit camp by id
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Unable to find campground');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

//! updates camp by id
//! can also used patch
router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    //! redirect mostly used in POST
    req.flash('success', 'Succefuly updated a campground');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//! deletes camp by id for now..
router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
