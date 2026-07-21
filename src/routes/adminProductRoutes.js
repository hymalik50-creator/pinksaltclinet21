const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} = require('../validators/productValidators');
const { handleValidationErrors } = require('../utils/validator');
const { authenticate } = require('../middlewares/auth');

/**
 * Admin Product Routes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all products
router.get('/', productController.getAdminProducts);

// Get product by ID
router.get('/:id', productIdValidator, handleValidationErrors, productController.getProductById);

// Create product
router.post('/', createProductValidator, handleValidationErrors, productController.createProduct);

// Update product
router.put('/:id', updateProductValidator, handleValidationErrors, productController.updateProduct);

// Delete product
router.delete('/:id', productIdValidator, handleValidationErrors, productController.deleteProduct);

module.exports = router;
