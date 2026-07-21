const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const inquiryController = require('../controllers/inquiryController');
const contactController = require('../controllers/contactController');

const { productSlugValidator } = require('../validators/productValidators');
const { createInquiryValidator } = require('../validators/inquiryValidators');
const { createContactValidator } = require('../validators/contactValidators');
const { handleValidationErrors } = require('../utils/validator');
const { inquiryLimiter, contactLimiter } = require('../middlewares/rateLimiter');

/**
 * Public Routes
 * No authentication required
 */

// Product Routes
router.get('/products', productController.getProducts);
router.get('/products/:slug', productSlugValidator, handleValidationErrors, productController.getProductBySlug);

// Category Routes
router.get('/categories', categoryController.getCategories);

// Inquiry Routes
router.post('/inquiries', inquiryLimiter, createInquiryValidator, handleValidationErrors, inquiryController.createInquiry);

// Contact Routes
router.post('/contact', contactLimiter, createContactValidator, handleValidationErrors, contactController.createMessage);

module.exports = router;
