const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const { authenticate } = require('../middlewares/auth');
const { uploadLimiter } = require('../middlewares/rateLimiter');

/**
 * Admin Image Routes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Upload image
router.post('/upload', uploadLimiter, upload.single('image'), imageController.uploadImage);

module.exports = router;
