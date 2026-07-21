const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * General API Rate Limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Login Rate Limiter
 * More restrictive to prevent brute force attacks
 */
const loginLimiter = rateLimit({
  windowMs: config.loginRateLimit.windowMs,
  max: config.loginRateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Contact Form Rate Limiter
 */
const contactLimiter = rateLimit({
  windowMs: config.server.env === 'production' ? 60 * 60 * 1000 : 60 * 1000, // 1 hour in prod, 1 min in dev
  max: config.server.env === 'production' ? 5 : 100, // 5 in prod, 100 in dev
  message: {
    success: false,
    message: 'Too many submissions, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.server.env === 'development', // Skip in development
});

/**
 * Inquiry Form Rate Limiter
 */
const inquiryLimiter = rateLimit({
  windowMs: config.server.env === 'production' ? 60 * 60 * 1000 : 60 * 1000, // 1 hour in prod, 1 min in dev
  max: config.server.env === 'production' ? 10 : 100, // 10 in prod, 100 in dev
  message: {
    success: false,
    message: 'Too many inquiries, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.server.env === 'development', // Skip in development
});

/**
 * Upload Rate Limiter
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    message: 'Too many uploads, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  loginLimiter,
  contactLimiter,
  inquiryLimiter,
  uploadLimiter,
};
