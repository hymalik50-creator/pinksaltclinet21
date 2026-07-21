const inquiryService = require('../services/inquiryService');
const ApiResponse = require('../utils/response');
const config = require('../config');

/**
 * Inquiry Controller
 * Handles product inquiry requests
 */

class InquiryController {
  // Public: Create inquiry
  async createInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.createInquiry(req.body);

      return ApiResponse.success(
        res,
        inquiry,
        'Inquiry submitted successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all inquiries
  async getInquiries(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = config.pagination.defaultPageSize,
        productId,
        status,
        country,
      } = req.query;

      const limit = Math.min(
        parseInt(pageSize),
        config.pagination.maxPageSize
      );

      const filters = {
        limit: limit + 1,
        productId,
        status,
        country,
      };

      const inquiries = await inquiryService.getAllInquiries(filters);

      const hasNextPage = inquiries.length > limit;
      const paginatedInquiries = hasNextPage ? inquiries.slice(0, -1) : inquiries;

      const totalItems = await inquiryService.getInquiryCount({ status });

      const pagination = {
        page: parseInt(page),
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage,
        hasPrevPage: parseInt(page) > 1,
      };

      // Return data in format that frontend expects: { items: [...] }
      return ApiResponse.paginated(
        res,
        { items: paginatedInquiries },
        pagination,
        'Inquiries retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get inquiry by ID
  async getInquiryById(req, res, next) {
    try {
      const { id } = req.params;

      const inquiry = await inquiryService.getInquiryById(id);

      return ApiResponse.success(
        res,
        inquiry,
        'Inquiry retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update inquiry status
  async updateInquiryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await inquiryService.updateInquiryStatus(id, status);

      return ApiResponse.success(
        res,
        inquiry,
        'Inquiry status updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete inquiry
  async deleteInquiry(req, res, next) {
    try {
      const { id } = req.params;

      await inquiryService.deleteInquiry(id);

      return ApiResponse.success(
        res,
        null,
        'Inquiry deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InquiryController();
