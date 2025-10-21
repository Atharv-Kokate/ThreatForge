const mongoose = require('mongoose');

/**
 * Product Memory Schema
 * Stores vector embeddings and context for retrieval-based learning
 */
const productMemorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  vectorData: [{
    type: Number,
    required: [true, 'Vector data is required']
  }],
  contextText: {
    type: String,
    required: [true, 'Context text is required'],
    trim: true,
    maxlength: [5000, 'Context text cannot exceed 5000 characters']
  },
  memoryType: {
    type: String,
    enum: ['risk-pattern', 'vulnerability-history', 'recommendation', 'user-feedback', 'system-learning'],
    required: [true, 'Memory type is required']
  },
  embeddingModel: {
    type: String,
    trim: true,
    default: 'text-embedding-ada-002'
  },
  vectorDimension: {
    type: Number,
    default: 1536
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  metadata: {
    source: {
      type: String,
      enum: ['risk-assessment', 'user-input', 'system-generated', 'external-source'],
      default: 'risk-assessment'
    },
    version: {
      type: String,
      trim: true
    },
    language: {
      type: String,
      default: 'en'
    },
    domain: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for similarity search (placeholder for vector operations)
productMemorySchema.virtual('similarityScore').get(function() {
  // This would be calculated during similarity searches
  return null;
});

// Method to update access information
productMemorySchema.methods.updateAccess = function() {
  this.lastAccessed = new Date();
  this.accessCount += 1;
  return this.save();
};

// Method to get memory summary
productMemorySchema.methods.getSummary = function() {
  return {
    id: this._id,
    productId: this.productId,
    memoryType: this.memoryType,
    contextLength: this.contextText.length,
    confidence: this.confidence,
    tags: this.tags,
    accessCount: this.accessCount,
    lastAccessed: this.lastAccessed
  };
};

// Static method to find similar memories
productMemorySchema.statics.findSimilar = function(productId, queryVector, limit = 5, threshold = 0.7) {
  // This is a placeholder for vector similarity search
  // In a real implementation, you would use a vector database like Pinecone or Weaviate
  return this.find({
    productId: productId,
    isActive: true
  })
  .sort({ confidence: -1, accessCount: -1 })
  .limit(limit);
};

// Static method to get memory statistics for a product
productMemorySchema.statics.getMemoryStatistics = function(productId) {
  return this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId), isActive: true } },
    {
      $group: {
        _id: null,
        totalMemories: { $sum: 1 },
        averageConfidence: { $avg: '$confidence' },
        memoryTypeDistribution: {
          $push: '$memoryType'
        },
        totalAccessCount: { $sum: '$accessCount' }
      }
    }
  ]);
};

// Index for better query performance
productMemorySchema.index({ productId: 1, memoryType: 1 });
productMemorySchema.index({ isActive: 1 });
productMemorySchema.index({ confidence: -1 });
productMemorySchema.index({ lastAccessed: -1 });
productMemorySchema.index({ tags: 1 });

// Compound index for vector operations (placeholder)
productMemorySchema.index({ productId: 1, isActive: 1, confidence: -1 });

module.exports = mongoose.model('ProductMemory', productMemorySchema);
