const mongoose = require('mongoose');

/**
 * Product Schema
 * Represents applications/products that can be analyzed for risks
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  ownerType: {
    type: String,
    enum: ['user', 'organization'],
    required: [true, 'Owner type is required']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'ownerType',
    required: [true, 'Owner ID is required']
  },
  category: {
    type: String,
    enum: ['web-application', 'mobile-app', 'api', 'desktop-app', 'iot-device', 'other'],
    default: 'web-application'
  },
  technology: {
    type: String,
    trim: true,
    maxlength: [200, 'Technology stack cannot exceed 200 characters']
  },
  version: {
    type: String,
    trim: true,
    maxlength: [50, 'Version cannot exceed 50 characters']
  },
  riskAssessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RiskAssessment'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    repository: {
      type: String,
      trim: true
    },
    deploymentUrl: {
      type: String,
      trim: true
    },
    documentation: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }]
  },
  lastAnalyzed: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for risk assessment count
productSchema.virtual('riskAssessmentCount').get(function() {
  return this.riskAssessments ? this.riskAssessments.length : 0;
});

// Virtual for latest risk assessment
productSchema.virtual('latestRiskAssessment', {
  ref: 'RiskAssessment',
  localField: '_id',
  foreignField: 'productId',
  options: { sort: { timestamp: -1 }, limit: 1 }
});

// Virtual for product memory
productSchema.virtual('memories', {
  ref: 'ProductMemory',
  localField: '_id',
  foreignField: 'productId'
});

// Method to add risk assessment
productSchema.methods.addRiskAssessment = function(riskAssessmentId) {
  if (!this.riskAssessments.includes(riskAssessmentId)) {
    this.riskAssessments.push(riskAssessmentId);
    this.lastAnalyzed = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to get risk summary
productSchema.methods.getRiskSummary = function() {
  return {
    productId: this._id,
    name: this.name,
    totalAssessments: this.riskAssessmentCount,
    lastAnalyzed: this.lastAnalyzed,
    category: this.category
  };
};

// Index for better query performance
productSchema.index({ ownerType: 1, ownerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ lastAnalyzed: -1 });
productSchema.index({ 'metadata.tags': 1 });

module.exports = mongoose.model('Product', productSchema);
