const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnv1uwkla',
  api_key: '223182965758823',
  api_secret: 'XLanGv7UQQfUAarPW7addnLT9M4',
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
