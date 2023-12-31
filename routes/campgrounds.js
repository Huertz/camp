const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
//! cloudinary index store file s
const upload = multer({ storage });

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../middleware/middleware');

const Campground = require('../models/campground');

//? there other way to restructure routes
//! show a campgrounds
router.get('/', catchAsync(campgrounds.index));

//! order does matter
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//? old way of implementing erros
// //! creates campground
router.post(
  '/',
  isLoggedIn,
  upload.array('image'),
  // validateCampground,
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
  isAuthor,
  upload.array('image'),
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

//! deletes camp by id for now..
router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground));

//? fancy way to restructure routes
// router
//   .route('/')
//   .get(catchAsync(campgrounds.index))
//   .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('Works');
//   });
// .post(
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );

// router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router
//   .route('/:id')
//   .get(catchAsync(campgrounds.showCampground))
//   .put(
//     isLoggedIn,
//     isAuthor,
//     validateCampground,
//     catchAsync(campgrounds.updateCampground)
//   )
//   .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// router.get(
//   '/:id/edit',
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.renderEditForm)
// );

module.exports = router;
