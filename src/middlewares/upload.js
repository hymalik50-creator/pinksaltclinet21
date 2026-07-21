const multer = require('multer');
const config = require('../config');
const { ValidationError } = require('../utils/errors');

/**
 * Multer Configuration for Image Upload
 * Stores files in memory for ImgBB upload
 */

// Memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    return cb(
      new ValidationError(
        `Invalid file type. Allowed types: ${config.upload.allowedTypes.join(', ')}`
      ),
      false
    );
  }

  // Check file extension
  const ext = file.originalname.toLowerCase().split('.').pop();
  if (!config.upload.allowedExtensions.includes(`.${ext}`)) {
    return cb(
      new ValidationError(
        `Invalid file extension. Allowed: ${config.upload.allowedExtensions.join(', ')}`
      ),
      false
    );
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 1,
  },
});

module.exports = upload;
