const { body, param } = require('express-validator');

/**
 * Inquiry Validators
 */

const createInquiryValidator = [
  body('productId')
    .optional()
    .trim(),

  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Company name must not exceed 150 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters'),

  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  body('quantity')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Quantity must not exceed 100 characters'),

  body('packaging')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Packaging must not exceed 100 characters'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
];

const updateInquiryStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Inquiry ID is required'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'processing', 'completed', 'rejected', 'new', 'read', 'responded', 'archived'])
    .withMessage('Invalid status value'),
];

const inquiryIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Inquiry ID is required'),
];

module.exports = {
  createInquiryValidator,
  updateInquiryStatusValidator,
  inquiryIdValidator,
};
