const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const config = require('../config');
const adminRepository = require('../repositories/adminRepository');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches admin user to request
 */

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Invalid token format');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Token verification failed');
    }

    // Get admin from database
    const admin = await adminRepository.findById(decoded.id);

    if (!admin) {
      throw new UnauthorizedError('Admin not found');
    }

    // Attach admin to request
    req.admin = {
      id: admin.id,
      email: admin.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication
 * Attaches admin if token exists but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwt.secret);
          const admin = await adminRepository.findById(decoded.id);
          
          if (admin) {
            req.admin = {
              id: admin.id,
              email: admin.email,
            };
          }
        } catch (error) {
          // Silently fail for optional auth
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
