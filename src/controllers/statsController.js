const productRepository = require('../repositories/productRepository');
const inquiryRepository = require('../repositories/inquiryRepository');
const ApiResponse = require('../utils/response');

/**
 * Stats Controller
 * Provides statistics for admin dashboard
 */

class StatsController {
  async getStats(req, res, next) {
    try {
      // Get product statistics
      const totalProducts = await productRepository.count();
      const publishedProducts = await productRepository.count({ isPublished: true });
      const featuredProducts = await productRepository.count({ isFeatured: true });

      // Get inquiry statistics
      const totalInquiries = await inquiryRepository.count();
      const newInquiries = await inquiryRepository.count({ status: 'new' });
      const pendingInquiries = await inquiryRepository.count({ status: 'pending' });

      const stats = {
        totalProducts,
        publishedProducts,
        featuredProducts,
        draftProducts: totalProducts - publishedProducts,
        totalInquiries,
        newInquiries,
        pendingInquiries,
        readInquiries: await inquiryRepository.count({ status: 'read' }),
        respondedInquiries: await inquiryRepository.count({ status: 'responded' }),
        archivedInquiries: await inquiryRepository.count({ status: 'archived' }),
      };

      return ApiResponse.success(
        res,
        stats,
        'Statistics retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StatsController();
