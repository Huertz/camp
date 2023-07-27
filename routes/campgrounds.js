const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

//! middlewere/backend validatation for camps
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//! show a campgrounds
router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

//! order does matter
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//? old way of implementing erros
//! creates campground
router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
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
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    );
    res.render('campgrounds/show', { campground });
  })
);

//! edit camp by id
router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

//! updates camp by id
//! can also used patch
router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    //! redirect mostly used in POST
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//! deletes camp by id for now..
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
