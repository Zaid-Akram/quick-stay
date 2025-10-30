const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// from cloudinary documentation
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


// form npm multer-storage-cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "QuickStay_dev",
    allowedFormats: ["png", "jpg", "jpeg"]
  },
});


module.exports = {
    cloudinary,
    storage,
};