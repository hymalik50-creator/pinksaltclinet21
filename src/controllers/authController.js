const authService = require('../services/authService');
const ApiResponse = require('../utils/response');

/**
 * Authentication Controller
 * Handles admin authentication requests
 */

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return ApiResponse.success(
        res,
        {
          token: result.token,
          user: result.admin,
          email: result.admin.email,
          role: result.admin.role,
          userId: result.admin.id,
        },
        'Login successful',
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // JWT is stateless, logout is handled client-side
      return ApiResponse.success(
        res,
        null,
        'Logout successful',
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getSession(req, res, next) {
    try {
      // Admin data is already attached by auth middleware
      return ApiResponse.success(
        res,
        {
          email: req.admin.email,
          name: req.admin.name,
          role: req.admin.role,
          userId: req.admin.id,
        },
        'Session valid',
        200
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
