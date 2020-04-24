import config from 'dotenv';

const cloudinary = require('cloudinary').v2;

config.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

function cloudinaryConstructor(file, whatDo, callback) {
  cloudinary.uploader[`${whatDo}`](file, function(error, result) {
    // upload tempFilePath
    if (error) {
      return callback(error, error);
    }
    return callback(null, result);
  });
}

export default cloudinaryConstructor;
