const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');
const { UnauthorizedError, ValidationError } = require('../utils/errors');
const config = require('../config');

/**
 * Authentication Service
 * Business logic for admin authentication
 */

class AuthService {
  async login(email, password) {
    try {
      // Find admin by email
      const admin = await adminRepository.findByEmail(email);

      if (!admin) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Update last login
      await adminRepository.updateLastLogin(admin.id);

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          role: admin.role || 'admin',
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.expire,
        }
      );

      return {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name || 'Admin User',
          role: admin.role || 'admin',
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const admin = await adminRepository.findById(decoded.id);

      if (!admin) {
        throw new UnauthorizedError('Admin not found');
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name || 'Admin User',
        role: admin.role || 'admin',
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      }
      throw error;
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = new AuthService();
