const RiskAssessment = require('../models/riskAssessment.model');
const Product = require('../models/product.model');
const ProductMemory = require('../models/productMemory.model');
const llmService = require('../utils/llmService');
const { AppError, catchAsync } = require('../middleware/error.middleware');
const { validationResult } = require('express-validator');

/**
 * Risk Assessment Controller
 * Handles risk analysis operations and LLM service integration
 */

/**
 * Analyze a product for security risks
 */
const analyzeProduct = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { productId } = req.params;
  const userId = req.user._id;
  const {
    analysisType = 'comprehensive',
    focus = 'security',
    depth = 'standard',
    includeRecommendations = true,
    previousAssessments = [],
    complianceRequirements = []
  } = req.body;

  // Get product and verify access
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if user has access to this product
  const hasAccess = 
    (product.ownerType === 'user' && product.ownerId.toString() === userId.toString()) ||
    (product.ownerType === 'organization' && req.user.organizationId && 
     product.ownerId.toString() === req.user.organizationId.toString());

  if (!hasAccess) {
    return next(new AppError('Access denied to this product', 403));
  }

  // Create initial risk assessment record
  const riskAssessment = await RiskAssessment.create({
    productId,
    userId,
    inputData: {
      analysisType,
      focus,
      depth,
      includeRecommendations,
      complianceRequirements
    },
    status: 'pending',
    timestamp: new Date()
  });

  try {
    // Prepare data for LLM service
    const productData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      technology: product.technology,
      version: product.version,
      userId,
      productId
    };

    const options = {
      analysisType,
      focus,
      depth,
      includeRecommendations,
      previousAssessments,
      complianceRequirements,
      sessionId: req.headers['x-session-id']
    };

    // Call LLM service
    const analysisResult = await llmService.analyzeProduct(productData, options);

    if (!analysisResult.success) {
      throw new Error('LLM analysis failed');
    }

    // Update risk assessment with results
    riskAssessment.resultSummary = analysisResult.data.resultSummary;
    riskAssessment.vulnerabilities = analysisResult.data.vulnerabilities;
    riskAssessment.recommendations = analysisResult.data.recommendations;
    riskAssessment.riskScore = analysisResult.data.riskScore;
    riskAssessment.riskLevel = analysisResult.data.riskLevel;
    riskAssessment.processingTime = analysisResult.data.processingTime;
    riskAssessment.llmModel = analysisResult.data.model;
    riskAssessment.status = 'completed';
    riskAssessment.metadata = {
      requestId: analysisResult.metadata.requestId,
      model: analysisResult.metadata.model,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    };

    await riskAssessment.save();

    // Add risk assessment to product
    await product.addRiskAssessment(riskAssessment._id);

    // Create product memory for future context
    if (analysisResult.data.resultSummary) {
      await ProductMemory.create({
        productId,
        contextText: analysisResult.data.resultSummary,
        memoryType: 'risk-pattern',
        confidence: analysisResult.data.confidence || 0.8,
        tags: ['security-analysis', product.category, analysisResult.data.riskLevel],
        metadata: {
          source: 'risk-assessment',
          version: '1.0',
          language: 'en'
        }
      });
    }

    res.json({
      success: true,
      message: 'Risk analysis completed successfully',
      data: {
        riskAssessment: riskAssessment.getSummary(),
        analysis: {
          summary: analysisResult.data.resultSummary,
          vulnerabilities: analysisResult.data.vulnerabilities,
          recommendations: analysisResult.data.recommendations,
          riskScore: analysisResult.data.riskScore,
          riskLevel: analysisResult.data.riskLevel,
          processingTime: analysisResult.data.processingTime
        }
      }
    });

  } catch (error) {
    // Update risk assessment with error
    riskAssessment.status = 'failed';
    riskAssessment.errorMessage = error.message;
    await riskAssessment.save();

    console.error('Risk analysis error:', error);
    
    return next(new AppError(
      `Risk analysis failed: ${error.message}`, 
      500
    ));
  }
});

/**
 * Get risk history for a product
 */
const getRiskHistory = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  // Verify product access
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const hasAccess = 
    (product.ownerType === 'user' && product.ownerId.toString() === userId.toString()) ||
    (product.ownerType === 'organization' && req.user.organizationId && 
     product.ownerId.toString() === req.user.organizationId.toString());

  if (!hasAccess) {
    return next(new AppError('Access denied to this product', 403));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const riskAssessments = await RiskAssessment.find({ productId })
    .populate('userId', 'name email')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await RiskAssessment.countDocuments({ productId });

  // Get risk statistics
  const stats = await RiskAssessment.getRiskStatistics(productId);

  res.json({
    success: true,
    data: {
      riskAssessments,
      statistics: stats[0] || {
        totalAssessments: 0,
        averageRiskScore: 0,
        maxRiskScore: 0,
        minRiskScore: 0,
        riskLevelDistribution: []
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAssessments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

/**
 * Get a specific risk assessment
 */
const getRiskAssessment = catchAsync(async (req, res, next) => {
  const { assessmentId } = req.params;
  const userId = req.user._id;

  const riskAssessment = await RiskAssessment.findById(assessmentId)
    .populate('productId', 'name description category')
    .populate('userId', 'name email');

  if (!riskAssessment) {
    return next(new AppError('Risk assessment not found', 404));
  }

  // Check access to the product
  const product = riskAssessment.productId;
  const hasAccess = 
    (product.ownerType === 'user' && product.ownerId.toString() === userId.toString()) ||
    (product.ownerType === 'organization' && req.user.organizationId && 
     product.ownerId.toString() === req.user.organizationId.toString());

  if (!hasAccess) {
    return next(new AppError('Access denied to this assessment', 403));
  }

  res.json({
    success: true,
    data: {
      riskAssessment
    }
  });
});

/**
 * Get risk statistics for a product
 */
const getRiskStatistics = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  // Verify product access
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const hasAccess = 
    (product.ownerType === 'user' && product.ownerId.toString() === userId.toString()) ||
    (product.ownerType === 'organization' && req.user.organizationId && 
     product.ownerId.toString() === req.user.organizationId.toString());

  if (!hasAccess) {
    return next(new AppError('Access denied to this product', 403));
  }

  const stats = await RiskAssessment.getRiskStatistics(productId);
  const memoryStats = await ProductMemory.getMemoryStatistics(productId);

  res.json({
    success: true,
    data: {
      riskStatistics: stats[0] || {
        totalAssessments: 0,
        averageRiskScore: 0,
        maxRiskScore: 0,
        minRiskScore: 0,
        riskLevelDistribution: []
      },
      memoryStatistics: memoryStats[0] || {
        totalMemories: 0,
        averageConfidence: 0,
        memoryTypeDistribution: [],
        totalAccessCount: 0
      }
    }
  });
});

/**
 * Batch analyze multiple products
 */
const batchAnalyze = catchAsync(async (req, res, next) => {
  const { productIds, analysisOptions = {} } = req.body;
  const userId = req.user._id;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return next(new AppError('Product IDs are required', 400));
  }

  // Get products and verify access
  const products = await Product.find({
    _id: { $in: productIds },
    $or: [
      { ownerType: 'user', ownerId: userId },
      { ownerType: 'organization', ownerId: req.user.organizationId }
    ]
  });

  if (products.length !== productIds.length) {
    return next(new AppError('Some products not found or access denied', 404));
  }

  try {
    const batchResult = await llmService.batchAnalyze(products, analysisOptions);

    res.json({
      success: true,
      message: 'Batch analysis initiated',
      data: {
        batchId: batchResult.data.batchId,
        productsAnalyzed: products.length,
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    return next(new AppError(`Batch analysis failed: ${error.message}`, 500));
  }
});

/**
 * Get LLM service health status
 */
const getServiceHealth = catchAsync(async (req, res, next) => {
  const healthStatus = await llmService.healthCheck();

  res.json({
    success: true,
    data: {
      llmService: healthStatus.data,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * Get available analysis models
 */
const getAvailableModels = catchAsync(async (req, res, next) => {
  try {
    const models = await llmService.getAvailableModels();
    
    res.json({
      success: true,
      data: models.data
    });
  } catch (error) {
    console.error('Get models error:', error);
    return next(new AppError(`Failed to get models: ${error.message}`, 500));
  }
});

module.exports = {
  analyzeProduct,
  getRiskHistory,
  getRiskAssessment,
  getRiskStatistics,
  batchAnalyze,
  getServiceHealth,
  getAvailableModels
};
