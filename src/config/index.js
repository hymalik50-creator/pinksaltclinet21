require('dotenv').config();

/**
 * Application Configuration
 * Centralized configuration management
 */

const config = {
  // Server Configuration
  server: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expire: process.env.JWT_EXPIRE || '7d',
  },

  // ImgBB Configuration
  imgbb: {
    apiKey: process.env.IMGBB_API_KEY,
    apiUrl: 'https://api.imgbb.com/1/upload',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Login Rate Limiting
  loginRateLimit: {
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS) || 5,
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(','),
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  },

  // Firestore Collections
  collections: {
    administrators: 'administrators',
    categories: 'categories',
    products: 'products',
    productImages: 'productImages',
    inquiries: 'inquiries',
    contactMessages: 'contactMessages',
  },
};

module.exports = config;
