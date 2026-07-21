const express = require('express');
const router = express.Router();

const inquiryController = require('../controllers/inquiryController');
const {
  updateInquiryStatusValidator,
  inquiryIdValidator,
} = require('../validators/inquiryValidators');
const { handleValidationErrors } = require('../utils/validator');
const { authenticate } = require('../middlewares/auth');

/**
 * Admin Inquiry Routes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all inquiries
router.get('/', inquiryController.getInquiries);

// Get inquiry by ID
router.get('/:id', inquiryIdValidator, handleValidationErrors, inquiryController.getInquiryById);

// Update inquiry status
router.put('/:id/status', updateInquiryStatusValidator, handleValidationErrors, inquiryController.updateInquiryStatus);

// Delete inquiry
router.delete('/:id', inquiryIdValidator, handleValidationErrors, inquiryController.deleteInquiry);

module.exports = router;
