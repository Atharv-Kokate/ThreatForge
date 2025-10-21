const express = require('express');
const { body, query } = require('express-validator');
const {
  analyzeProduct,
  getRiskHistory,
  getRiskAssessment,
  getRiskStatistics,
  batchAnalyze,
  getServiceHealth,
  getAvailableModels
} = require('../controllers/risk.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Risk Assessment Routes
 * Handles risk analysis operations and LLM service integration
 */

// Validation rules
const analyzeProductValidation = [
  body('analysisType')
    .optional()
    .isIn(['comprehensive', 'quick', 'deep', 'focused'])
    .withMessage('Invalid analysis type'),
  body('focus')
    .optional()
    .isIn(['security', 'performance', 'compliance', 'all'])
    .withMessage('Invalid focus area'),
  body('depth')
    .optional()
    .isIn(['standard', 'detailed', 'comprehensive'])
    .withMessage('Invalid depth level'),
  body('includeRecommendations')
    .optional()
    .isBoolean()
    .withMessage('includeRecommendations must be a boolean'),
  body('previousAssessments')
    .optional()
    .isArray()
    .withMessage('previousAssessments must be an array'),
  body('complianceRequirements')
    .optional()
    .isArray()
    .withMessage('complianceRequirements must be an array')
];

const batchAnalyzeValidation = [
  body('productIds')
    .isArray({ min: 1, max: 10 })
    .withMessage('productIds must be an array with 1-10 items'),
  body('productIds.*')
    .isMongoId()
    .withMessage('Each product ID must be a valid MongoDB ObjectId'),
  body('analysisOptions.analysisType')
    .optional()
    .isIn(['comprehensive', 'quick', 'deep', 'focused'])
    .withMessage('Invalid analysis type'),
  body('analysisOptions.focus')
    .optional()
    .isIn(['security', 'performance', 'compliance', 'all'])
    .withMessage('Invalid focus area'),
  body('analysisOptions.depth')
    .optional()
    .isIn(['standard', 'detailed', 'comprehensive'])
    .withMessage('Invalid depth level')
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

// Risk analysis routes
router.post('/analyze/:productId', analyzeProductValidation, analyzeProduct);
router.get('/history/:productId', queryValidation, getRiskHistory);
router.get('/assessment/:assessmentId', getRiskAssessment);
router.get('/statistics/:productId', getRiskStatistics);
router.post('/batch-analyze', batchAnalyzeValidation, batchAnalyze);

// Service management routes
router.get('/service/health', getServiceHealth);
router.get('/service/models', getAvailableModels);

module.exports = router;
