const express = require('express');
const { body, query } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  searchProducts
} = require('../controllers/product.controller');
const { verifyToken, verifyOrganizationAccess } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Product Routes
 * Handles CRUD operations for products
 */

// Validation rules
const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['web-application', 'mobile-app', 'api', 'desktop-app', 'iot-device', 'other'])
    .withMessage('Invalid category'),
  body('technology')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Technology stack cannot exceed 200 characters'),
  body('version')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Version cannot exceed 50 characters'),
  body('metadata.repository')
    .optional()
    .isURL()
    .withMessage('Repository must be a valid URL'),
  body('metadata.deploymentUrl')
    .optional()
    .isURL()
    .withMessage('Deployment URL must be a valid URL'),
  body('metadata.documentation')
    .optional()
    .isURL()
    .withMessage('Documentation URL must be a valid URL'),
  body('metadata.tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('metadata.tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters')
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['web-application', 'mobile-app', 'api', 'desktop-app', 'iot-device', 'other'])
    .withMessage('Invalid category'),
  body('technology')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Technology stack cannot exceed 200 characters'),
  body('version')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Version cannot exceed 50 characters')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['web-application', 'mobile-app', 'api', 'desktop-app', 'iot-device', 'other'])
    .withMessage('Invalid category filter'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters')
];

// All routes require authentication
router.use(verifyToken);

// Product CRUD routes
router.post('/', createProductValidation, createProduct);
router.get('/', queryValidation, getProducts);
router.get('/search', queryValidation, searchProducts);
router.get('/stats', getProductStats);
router.get('/:productId', getProduct);
router.put('/:productId', updateProductValidation, updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;
