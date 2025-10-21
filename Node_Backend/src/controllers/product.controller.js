const Product = require('../models/product.model');
const RiskAssessment = require('../models/riskAssessment.model');
const { AppError, catchAsync } = require('../middleware/error.middleware');
const { validationResult } = require('express-validator');

/**
 * Product Controller
 * Handles CRUD operations for products and related functionality
 */

/**
 * Create a new product
 */
const createProduct = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const {
    name,
    description,
    category,
    technology,
    version,
    metadata
  } = req.body;

  const userId = req.user._id;
  const userRole = req.user.role;

  // Determine owner type and ID
  let ownerType = 'user';
  let ownerId = userId;

  // If user is organization admin, they can create products for their organization
  if (userRole === 'organizationAdmin' && req.body.ownerType === 'organization') {
    ownerType = 'organization';
    ownerId = req.user.organizationId;
  }

  const product = await Product.create({
    name,
    description,
    category,
    technology,
    version,
    metadata,
    ownerType,
    ownerId
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product
    }
  });
});

/**
 * Get all products for the current user/organization
 */
const getProducts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  let query = {};

  // Build query based on user role
  if (userRole === 'individual') {
    query = { ownerType: 'user', ownerId: userId };
  } else if (userRole === 'organizationAdmin') {
    query = {
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  // Add filters
  const { category, isActive, search } = req.query;
  
  if (category) {
    query.category = category;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { technology: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .populate('riskAssessments', 'riskScore riskLevel timestamp status')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

/**
 * Get a single product by ID
 */
const getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  let query = { _id: productId };

  // Add access control
  if (userRole === 'individual') {
    query.ownerType = 'user';
    query.ownerId = userId;
  } else if (userRole === 'organizationAdmin') {
    query = {
      _id: productId,
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  const product = await Product.findOne(query)
    .populate('riskAssessments', 'riskScore riskLevel timestamp status vulnerabilities')
    .populate('ownerId', 'name email');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.json({
    success: true,
    data: {
      product
    }
  });
});

/**
 * Update a product
 */
const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  let query = { _id: productId };

  // Add access control
  if (userRole === 'individual') {
    query.ownerType = 'user';
    query.ownerId = userId;
  } else if (userRole === 'organizationAdmin') {
    query = {
      _id: productId,
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  const product = await Product.findOne(query);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product: updatedProduct
    }
  });
});

/**
 * Delete a product
 */
const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  let query = { _id: productId };

  // Add access control
  if (userRole === 'individual') {
    query.ownerType = 'user';
    query.ownerId = userId;
  } else if (userRole === 'organizationAdmin') {
    query = {
      _id: productId,
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  const product = await Product.findOne(query);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Soft delete by setting isActive to false
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

/**
 * Get product statistics
 */
const getProductStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  let matchQuery = {};

  // Build match query based on user role
  if (userRole === 'individual') {
    matchQuery = { ownerType: 'user', ownerId: userId };
  } else if (userRole === 'organizationAdmin') {
    matchQuery = {
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  const stats = await Product.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        categoryDistribution: {
          $push: '$category'
        },
        lastAnalyzed: { $max: '$lastAnalyzed' }
      }
    }
  ]);

  const riskStats = await RiskAssessment.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalAssessments: { $sum: 1 },
        averageRiskScore: { $avg: '$riskScore' },
        riskLevelDistribution: {
          $push: '$riskLevel'
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      productStats: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        categoryDistribution: [],
        lastAnalyzed: null
      },
      riskStats: riskStats[0] || {
        totalAssessments: 0,
        averageRiskScore: 0,
        riskLevelDistribution: []
      }
    }
  });
});

/**
 * Search products
 */
const searchProducts = catchAsync(async (req, res, next) => {
  const { q, category, technology } = req.query;
  const userId = req.user._id;
  const userRole = req.user.role;
  const organizationId = req.user.organizationId;

  let query = {};

  // Build base query
  if (userRole === 'individual') {
    query = { ownerType: 'user', ownerId: userId };
  } else if (userRole === 'organizationAdmin') {
    query = {
      $or: [
        { ownerType: 'user', ownerId: userId },
        { ownerType: 'organization', ownerId: organizationId }
      ]
    };
  }

  // Add search filters
  if (q) {
    query.$and = [
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { technology: { $regex: q, $options: 'i' } }
        ]
      }
    ];
  }

  if (category) {
    query.category = category;
  }

  if (technology) {
    query.technology = { $regex: technology, $options: 'i' };
  }

  const products = await Product.find(query)
    .populate('riskAssessments', 'riskScore riskLevel timestamp')
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    data: {
      products,
      searchQuery: { q, category, technology }
    }
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  searchProducts
};
