const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const { generateToken } = require('../middleware/auth.middleware');
const { AppError, catchAsync } = require('../middleware/error.middleware');
const { validationResult } = require('express-validator');

/**
 * Authentication Controller
 * Handles user registration, login, and authentication-related operations
 */

/**
 * Register a new user (individual or organization admin)
 */
const register = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
  }

  const { name, email, password, role, organizationData } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  let user;
  let organization = null;

  // Handle organization registration
  if (role === 'organizationAdmin' && organizationData) {
    // Create organization first
    organization = await Organization.create({
      name: organizationData.name,
      domain: organizationData.domain,
      adminEmail: email,
      description: organizationData.description
    });

    // Create organization admin user
    user = await User.create({
      name,
      email,
      password,
      role: 'organizationAdmin',
      organizationId: organization._id
    });

    // Add user to organization
    organization.users.push(user._id);
    await organization.save();
  } else {
    // Create individual user
    user = await User.create({
      name,
      email,
      password,
      role: 'individual'
    });
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.getPublicProfile(),
      organization: organization ? {
        id: organization._id,
        name: organization.name,
        domain: organization.domain
      } : null,
      token
    }
  });
});

/**
 * Login user
 */
const login = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Account is deactivated', 401));
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Get organization info if user belongs to one
  let organization = null;
  if (user.organizationId) {
    organization = await Organization.findById(user.organizationId);
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getPublicProfile(),
      organization: organization ? {
        id: organization._id,
        name: organization.name,
        domain: organization.domain
      } : null,
      token
    }
  });
});

/**
 * Get current user profile
 */
const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('organizationId', 'name domain')
    .populate('products', 'name description category lastAnalyzed');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      organization: user.organizationId,
      products: user.products
    }
  });
});

/**
 * Update user profile
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  // Check if email is being changed and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return next(new AppError('Email is already taken', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * Change password
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Get user with password
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * Deactivate user account
 */
const deactivateAccount = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

/**
 * Logout user (client-side token removal)
 */
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * Refresh token
 */
const refreshToken = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  
  // Generate new token
  const token = generateToken(userId);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  logout,
  refreshToken
};
