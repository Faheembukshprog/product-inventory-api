/**
 * validators/productValidator.js
 * Input validation rules for product create + update.
 */
const { body } = require('express-validator');

const createProductRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Grocery', 'Toys', 'Other'])
    .withMessage('Invalid category'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const updateProductRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .optional()
    .trim()
    .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Grocery', 'Toys', 'Other'])
    .withMessage('Invalid category'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

module.exports = { createProductRules, updateProductRules };
