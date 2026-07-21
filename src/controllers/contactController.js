const contactService = require('../services/contactService');
const ApiResponse = require('../utils/response');
const config = require('../config');

/**
 * Contact Controller
 * Handles contact form submissions
 */

class ContactController {
  // Public: Create contact message
  async createMessage(req, res, next) {
    try {
      const message = await contactService.createMessage(req.body);

      return ApiResponse.success(
        res,
        message,
        'Message sent successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all messages
  async getMessages(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = config.pagination.defaultPageSize,
        search,
      } = req.query;

      const limit = Math.min(
        parseInt(pageSize),
        config.pagination.maxPageSize
      );

      const filters = {
        limit: limit + 1,
        search,
      };

      const messages = await contactService.getAllMessages(filters);

      const hasNextPage = messages.length > limit;
      const paginatedMessages = hasNextPage ? messages.slice(0, -1) : messages;

      const totalItems = await contactService.getMessageCount();

      const pagination = {
        page: parseInt(page),
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage,
        hasPrevPage: parseInt(page) > 1,
      };

      return ApiResponse.paginated(
        res,
        { items: paginatedMessages },
        pagination,
        'Messages retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get message by ID
  async getMessageById(req, res, next) {
    try {
      const { id } = req.params;

      const message = await contactService.getMessageById(id);

      return ApiResponse.success(
        res,
        message,
        'Message retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete message
  async deleteMessage(req, res, next) {
    try {
      const { id } = req.params;

      await contactService.deleteMessage(id);

      return ApiResponse.success(
        res,
        null,
        'Message deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();
