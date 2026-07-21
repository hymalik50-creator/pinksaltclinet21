const { body, param } = require('express-validator');

/**
 * Category Validators
 */

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('imageUrl')
    .optional({ values: 'falsy' }) // Allow empty string, null, undefined
    .trim()
    .custom((value) => {
      // Allow empty string
      if (!value || value === '') return true;
      // If provided, must be valid URL
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(value)) {
        throw new Error('Invalid image URL');
      }
      return true;
    }),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
];

const updateCategoryValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('imageUrl')
    .optional({ values: 'falsy' }) // Allow empty string, null, undefined
    .trim()
    .custom((value) => {
      // Allow empty string
      if (!value || value === '') return true;
      // If provided, must be valid URL
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(value)) {
        throw new Error('Invalid image URL');
      }
      return true;
    }),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
];

const categoryIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
