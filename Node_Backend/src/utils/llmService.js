const axios = require('axios');

/**
 * LLM Service Integration
 * Handles communication with the FastAPI LLM service for risk analysis
 */

class LLMService {
  constructor() {
    this.baseURL = process.env.LLM_SERVICE_URL || 'http://localhost:8000';
    this.timeout = parseInt(process.env.LLM_SERVICE_TIMEOUT) || 30000;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'OWASP-Risk-Platform/1.0'
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[LLM Service] Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[LLM Service] Request error:', error.message);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[LLM Service] Response received: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('[LLM Service] Response error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Analyze product for security risks using LLM service
   * @param {Object} productData - Product information and analysis data
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeProduct(productData, options = {}) {
    try {
      const requestPayload = {
        product: {
          name: productData.name,
          description: productData.description,
          category: productData.category,
          technology: productData.technology,
          version: productData.version
        },
        analysis: {
          type: options.analysisType || 'comprehensive',
          focus: options.focus || 'security',
          depth: options.depth || 'standard',
          includeRecommendations: options.includeRecommendations !== false
        },
        questionnaire: options.questionnaire || {},
        context: {
          previousAssessments: options.previousAssessments || [],
          organizationProfile: options.organizationProfile || null,
          complianceRequirements: options.complianceRequirements || []
        },
        metadata: {
          userId: productData.userId,
          productId: productData.productId,
          timestamp: new Date().toISOString(),
          sessionId: options.sessionId || null
        }
      };

      console.log('[LLM Service] Sending analysis request:', {
        productName: productData.name,
        analysisType: requestPayload.analysis.type
      });

      const response = await this.client.post('/analyze', requestPayload);
      
      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from LLM service');
      }

      return {
        success: true,
        data: {
          resultSummary: response.data.summary || 'Analysis completed',
          vulnerabilities: response.data.vulnerabilities || [],
          recommendations: response.data.recommendations || [],
          riskScore: response.data.riskScore || 0,
          riskLevel: response.data.riskLevel || 'low',
          processingTime: response.data.processingTime || 0,
          model: response.data.model || 'unknown',
          confidence: response.data.confidence || 0.8
        },
        metadata: {
          requestId: response.data.requestId,
          timestamp: response.data.timestamp,
          model: response.data.model
        }
      };

    } catch (error) {
      console.error('[LLM Service] Analysis failed:', error.message);
      
      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new Error('LLM service is unavailable. Please try again later.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Analysis request timed out. Please try again.');
      }
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || 'Analysis failed';
        
        if (status === 400) {
          throw new Error(`Invalid request: ${message}`);
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status >= 500) {
          throw new Error('LLM service is experiencing issues. Please try again later.');
        } else {
          throw new Error(`Analysis failed: ${message}`);
        }
      }
      
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Get analysis status from LLM service
   * @param {string} requestId - Request ID to check status
   * @returns {Promise<Object>} Status information
   */
  async getAnalysisStatus(requestId) {
    try {
      const response = await this.client.get(`/status/${requestId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[LLM Service] Status check failed:', error.message);
      throw new Error(`Status check failed: ${error.message}`);
    }
  }

  /**
   * Get available analysis models from LLM service
   * @returns {Promise<Object>} Available models
   */
  async getAvailableModels() {
    try {
      const response = await this.client.get('/models');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[LLM Service] Models fetch failed:', error.message);
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }

  /**
   * Health check for LLM service
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      
      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'LLM Risk Analysis Service'
        }
      };
    } catch (error) {
      console.error('[LLM Service] Health check failed:', error.message);
      return {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      };
    }
  }

  /**
   * Batch analyze multiple products
   * @param {Array} products - Array of product data
   * @param {Object} options - Analysis options
   * @returns {Promise<Array>} Analysis results
   */
  async batchAnalyze(products, options = {}) {
    try {
      const batchPayload = {
        products: products.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          technology: product.technology
        })),
        analysis: {
          type: options.analysisType || 'comprehensive',
          focus: options.focus || 'security',
          depth: options.depth || 'standard'
        },
        metadata: {
          batchId: options.batchId || `batch_${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      };

      const response = await this.client.post('/batch-analyze', batchPayload);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[LLM Service] Batch analysis failed:', error.message);
      throw new Error(`Batch analysis failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const llmService = new LLMService();

module.exports = llmService;
