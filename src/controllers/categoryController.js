const categoryService = require('../services/categoryService');
const ApiResponse = require('../utils/response');
const config = require('../config');

/**
 * Category Controller
 * Handles category-related requests
 */

class CategoryController {
  // Public: Get all categories
  async getCategories(req, res, next) {
    try {
      const { search } = req.query;

      const filters = {
        isPublished: true,
        search,
      };

      const categories = await categoryService.getAllCategories(filters);

      return ApiResponse.success(
        res,
        categories,
        'Categories retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all categories
  async getAdminCategories(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = config.pagination.defaultPageSize,
        isPublished,
        search,
      } = req.query;

      const limit = Math.min(
        parseInt(pageSize),
        config.pagination.maxPageSize
      );

      const filters = {
        limit: limit + 1,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        search,
      };

      const categories = await categoryService.getAllCategories(filters);

      const hasNextPage = categories.length > limit;
      const paginatedCategories = hasNextPage ? categories.slice(0, -1) : categories;

      const totalItems = await categoryService.getCategoryCount({
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      });

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
        paginatedCategories,
        pagination,
        'Categories retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get category by ID
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const category = await categoryService.getCategoryById(id);

      return ApiResponse.success(
        res,
        category,
        'Category retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Create category
  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);

      return ApiResponse.success(
        res,
        category,
        'Category created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update category
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await categoryService.updateCategory(id, req.body);

      return ApiResponse.success(
        res,
        category,
        'Category updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete category
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      await categoryService.deleteCategory(id);

      return ApiResponse.success(
        res,
        null,
        'Category deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
