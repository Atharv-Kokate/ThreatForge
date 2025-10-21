const mongoose = require('mongoose');

/**
 * Risk Assessment Schema
 * Stores the results of LLM-based risk analysis for products
 */
const riskAssessmentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  inputData: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Input data is required']
  },
  resultSummary: {
    type: String,
    required: [true, 'Result summary is required'],
    trim: true
  },
  vulnerabilities: [{
    type: String,
    trim: true
  }],
  riskScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  recommendations: [{
    type: String,
    trim: true
  }],
  llmModel: {
    type: String,
    trim: true,
    default: 'gpt-4'
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String,
    trim: true
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionId: String,
    requestId: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vulnerability count
riskAssessmentSchema.virtual('vulnerabilityCount').get(function() {
  return this.vulnerabilities ? this.vulnerabilities.length : 0;
});

// Virtual for recommendation count
riskAssessmentSchema.virtual('recommendationCount').get(function() {
  return this.recommendations ? this.recommendations.length : 0;
});

// Method to calculate risk score based on vulnerabilities
riskAssessmentSchema.methods.calculateRiskScore = function() {
  const vulnerabilityCount = this.vulnerabilityCount;
  
  if (vulnerabilityCount === 0) {
    this.riskScore = 1;
    this.riskLevel = 'low';
  } else if (vulnerabilityCount <= 3) {
    this.riskScore = 4;
    this.riskLevel = 'medium';
  } else if (vulnerabilityCount <= 7) {
    this.riskScore = 7;
    this.riskLevel = 'high';
  } else {
    this.riskScore = 9;
    this.riskLevel = 'critical';
  }
  
  return this;
};

// Method to get assessment summary
riskAssessmentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    productId: this.productId,
    riskScore: this.riskScore,
    riskLevel: this.riskLevel,
    vulnerabilityCount: this.vulnerabilityCount,
    recommendationCount: this.recommendationCount,
    status: this.status,
    timestamp: this.timestamp
  };
};

// Static method to get risk statistics for a product
riskAssessmentSchema.statics.getRiskStatistics = function(productId) {
  return this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAssessments: { $sum: 1 },
        averageRiskScore: { $avg: '$riskScore' },
        maxRiskScore: { $max: '$riskScore' },
        minRiskScore: { $min: '$riskScore' },
        riskLevelDistribution: {
          $push: '$riskLevel'
        }
      }
    }
  ]);
};

// Index for better query performance
riskAssessmentSchema.index({ productId: 1, timestamp: -1 });
riskAssessmentSchema.index({ userId: 1, timestamp: -1 });
riskAssessmentSchema.index({ status: 1 });
riskAssessmentSchema.index({ riskLevel: 1 });
riskAssessmentSchema.index({ riskScore: -1 });

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
