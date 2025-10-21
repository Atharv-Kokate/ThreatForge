const Organization = require('../models/organization.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const { AppError, catchAsync } = require('../middleware/error.middleware');
const { validationResult } = require('express-validator');

/**
 * Organization Controller
 * Handles organization management operations
 */

/**
 * Create a new organization
 */
const createOrganization = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { name, domain, description, adminEmail } = req.body;

  // Check if organization with this domain already exists
  const existingOrg = await Organization.findOne({ domain });
  if (existingOrg) {
    return next(new AppError('Organization with this domain already exists', 400));
  }

  // Check if admin email is already in use
  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) {
    return next(new AppError('Admin email is already registered', 400));
  }

  // Create organization
  const organization = await Organization.create({
    name,
    domain,
    adminEmail,
    description
  });

  res.status(201).json({
    success: true,
    message: 'Organization created successfully',
    data: {
      organization
    }
  });
});

/**
 * Get organization details
 */
const getOrganization = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  const organization = await Organization.findById(organizationId)
    .populate('users', 'name email role lastLogin')
    .populate('products', 'name description category lastAnalyzed');

  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  res.json({
    success: true,
    data: {
      organization
    }
  });
});

/**
 * Update organization
 */
const updateOrganization = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const organization = await Organization.findByIdAndUpdate(
    organizationId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  res.json({
    success: true,
    message: 'Organization updated successfully',
    data: {
      organization
    }
  });
});

/**
 * Add user to organization
 */
const addUser = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const { email, name, role = 'individual' } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  
  if (user) {
    // User exists, check if already in organization
    if (user.organizationId && user.organizationId.toString() === organizationId) {
      return next(new AppError('User is already in this organization', 400));
    }
    
    if (user.organizationId) {
      return next(new AppError('User is already in another organization', 400));
    }

    // Add user to organization
    user.organizationId = organizationId;
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      password: 'temp-password-' + Date.now(), // Temporary password
      role,
      organizationId
    });
  }

  // Add user to organization
  await organization.addUser(user._id);

  res.json({
    success: true,
    message: 'User added to organization successfully',
    data: {
      user: user.getPublicProfile(),
      organization: {
        id: organization._id,
        name: organization.name
      }
    }
  });
});

/**
 * Remove user from organization
 */
const removeUser = catchAsync(async (req, res, next) => {
  const { organizationId, userId: targetUserId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user is in this organization
  if (user.organizationId.toString() !== organizationId) {
    return next(new AppError('User is not in this organization', 400));
  }

  // Remove user from organization
  user.organizationId = null;
  user.role = 'individual';
  await user.save();

  await organization.removeUser(targetUserId);

  res.json({
    success: true,
    message: 'User removed from organization successfully'
  });
});

/**
 * Get organization users
 */
const getOrganizationUsers = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  const organization = await Organization.findById(organizationId)
    .populate('users', 'name email role lastLogin isActive');

  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = organization.users.slice(skip, skip + limit);
  const total = organization.users.length;

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

/**
 * Get organization statistics
 */
const getOrganizationStats = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  // Get organization statistics
  const userStats = await User.aggregate([
    { $match: { organizationId: organization._id } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        roleDistribution: {
          $push: '$role'
        }
      }
    }
  ]);

  const productStats = await Product.aggregate([
    { $match: { ownerType: 'organization', ownerId: organization._id } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        categoryDistribution: {
          $push: '$category'
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      organization: {
        id: organization._id,
        name: organization.name,
        domain: organization.domain,
        createdAt: organization.createdAt
      },
      userStats: userStats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        roleDistribution: []
      },
      productStats: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        categoryDistribution: []
      }
    }
  });
});

/**
 * Update organization settings
 */
const updateSettings = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const { settings } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Check if user has access to this organization
  if (userRole === 'individual') {
    return next(new AppError('Access denied', 403));
  }

  if (userRole === 'organizationAdmin' && req.user.organizationId.toString() !== organizationId) {
    return next(new AppError('Access denied to this organization', 403));
  }

  const organization = await Organization.findByIdAndUpdate(
    organizationId,
    { settings },
    { new: true, runValidators: true }
  );

  if (!organization) {
    return next(new AppError('Organization not found', 404));
  }

  res.json({
    success: true,
    message: 'Organization settings updated successfully',
    data: {
      settings: organization.settings
    }
  });
});

module.exports = {
  createOrganization,
  getOrganization,
  updateOrganization,
  addUser,
  removeUser,
  getOrganizationUsers,
  getOrganizationStats,
  updateSettings
};
