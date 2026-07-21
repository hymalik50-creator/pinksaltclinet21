const { body, param } = require('express-validator');

/**
 * Product Validators
 */

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),

  body('categoryId')
    .optional()
    .trim(),
  
  body('category')
    .optional()
    .trim(),

  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Short description must not exceed 300 characters'),

  body('fullDescription')
    .optional()
    .trim(),

  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),

  body('packaging')
    .optional()
    .isArray()
    .withMessage('Packaging must be an array'),

  body('minimumOrderQuantity')
    .optional()
    .trim(),

  body('origin')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Origin must not exceed 100 characters'),

  body('usage')
    .optional()
    .trim(),

  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),

  body('availability')
    .optional()
    .custom((value) => {
      // Accept boolean or string values
      if (typeof value === 'boolean') return true;
      if (typeof value === 'string' && ['in-stock', 'made-to-order', 'out-of-stock'].includes(value)) return true;
      throw new Error('Availability must be a boolean or one of: in-stock, made-to-order, out-of-stock');
    }),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),

  body('metaTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Meta title must not exceed 100 characters'),

  body('metaDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Meta description must not exceed 200 characters'),

  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
];

const updateProductValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required'),

  ...createProductValidator.filter(v => v.builder.fields[0] !== 'name'),
];

const productIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required'),
];

const productSlugValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Product slug is required'),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  productSlugValidator,
};
