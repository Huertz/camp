const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//! first step
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//! secound step
const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'Camps',
  allowedFormats: ['jpeg', 'png', 'jpg'],
});

module.exports = {
  cloudinary,
  storage,
};
