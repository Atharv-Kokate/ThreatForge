const express = require('express');
const { body, query } = require('express-validator');
const {
  createOrganization,
  getOrganization,
  updateOrganization,
  addUser,
  removeUser,
  getOrganizationUsers,
  getOrganizationStats,
  updateSettings
} = require('../controllers/organization.controller');
const { verifyToken, verifyRole, verifyOrganizationAccess } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Organization Routes
 * Handles organization management operations
 */

// Validation rules
const createOrganizationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('domain')
    .isFQDN()
    .withMessage('Please provide a valid domain'),
  body('adminEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid admin email'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateOrganizationValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('domain')
    .optional()
    .isFQDN()
    .withMessage('Please provide a valid domain'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const addUserValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['individual', 'organizationAdmin'])
    .withMessage('Role must be either individual or organizationAdmin')
];

const updateSettingsValidation = [
  body('settings.allowUserRegistration')
    .optional()
    .isBoolean()
    .withMessage('allowUserRegistration must be a boolean'),
  body('settings.maxUsers')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('maxUsers must be between 1 and 1000'),
  body('settings.maxProducts')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('maxProducts must be between 1 and 10000')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// All routes require authentication
router.use(verifyToken);

// Organization management routes
router.post('/', createOrganizationValidation, createOrganization);
router.get('/:organizationId', verifyOrganizationAccess, getOrganization);
router.put('/:organizationId', verifyOrganizationAccess, updateOrganizationValidation, updateOrganization);
router.get('/:organizationId/stats', verifyOrganizationAccess, getOrganizationStats);
router.put('/:organizationId/settings', verifyOrganizationAccess, updateSettingsValidation, updateSettings);

// User management routes
router.post('/:organizationId/users', verifyOrganizationAccess, addUserValidation, addUser);
router.delete('/:organizationId/users/:userId', verifyOrganizationAccess, removeUser);
router.get('/:organizationId/users', verifyOrganizationAccess, queryValidation, getOrganizationUsers);

module.exports = router;
