const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const { contactIdValidator } = require('../validators/contactValidators');
const { handleValidationErrors } = require('../utils/validator');
const { authenticate } = require('../middlewares/auth');

/**
 * Admin Contact Routes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all contact messages
router.get('/', contactController.getMessages);

// Get contact message by ID
router.get('/:id', contactIdValidator, handleValidationErrors, contactController.getMessageById);

// Delete contact message
router.delete('/:id', contactIdValidator, handleValidationErrors, contactController.deleteMessage);

module.exports = router;
