const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidators');
const { handleValidationErrors } = require('../utils/validator');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { authenticate } = require('../middlewares/auth');

/**
 * Admin Authentication Routes
 */

// Login
router.post('/login', loginLimiter, loginValidator, handleValidationErrors, authController.login);

// Logout
router.post('/logout', authenticate, authController.logout);

// Get Session
router.get('/session', authenticate, authController.getSession);

module.exports = router;
