const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} = require('../validators/categoryValidators');
const { handleValidationErrors } = require('../utils/validator');
const { authenticate } = require('../middlewares/auth');

/**
 * Admin Category Routes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all categories
router.get('/', categoryController.getAdminCategories);

// Get category by ID
router.get('/:id', categoryIdValidator, handleValidationErrors, categoryController.getCategoryById);

// Create category
router.post('/', createCategoryValidator, handleValidationErrors, categoryController.createCategory);

// Update category
router.put('/:id', updateCategoryValidator, handleValidationErrors, categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryIdValidator, handleValidationErrors, categoryController.deleteCategory);

module.exports = router;
