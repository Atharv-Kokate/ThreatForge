const mongoose = require('mongoose');

/**
 * Organization Schema
 * Represents organizations that can have multiple users and products
 */
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Please enter a valid domain']
  },
  adminEmail: {
    type: String,
    required: [true, 'Admin email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowUserRegistration: {
      type: Boolean,
      default: true
    },
    maxUsers: {
      type: Number,
      default: 50
    },
    maxProducts: {
      type: Number,
      default: 100
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for organization's risk assessments
organizationSchema.virtual('riskAssessments', {
  ref: 'RiskAssessment',
  localField: 'products',
  foreignField: 'productId'
});

// Virtual for user count
organizationSchema.virtual('userCount').get(function() {
  return this.users ? this.users.length : 0;
});

// Virtual for product count
organizationSchema.virtual('productCount').get(function() {
  return this.products ? this.products.length : 0;
});

// Method to add user to organization
organizationSchema.methods.addUser = function(userId) {
  if (!this.users.includes(userId)) {
    this.users.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove user from organization
organizationSchema.methods.removeUser = function(userId) {
  this.users = this.users.filter(id => !id.equals(userId));
  return this.save();
};

// Method to add product to organization
organizationSchema.methods.addProduct = function(productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove product from organization
organizationSchema.methods.removeProduct = function(productId) {
  this.products = this.products.filter(id => !id.equals(productId));
  return this.save();
};

// Index for better query performance
organizationSchema.index({ domain: 1 });
organizationSchema.index({ adminEmail: 1 });
organizationSchema.index({ isActive: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
