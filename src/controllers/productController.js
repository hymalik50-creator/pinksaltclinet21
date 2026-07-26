const productService = require('../services/productService');
const ApiResponse = require('../utils/response');
const config = require('../config');

/**
 * Product Controller
 * Handles product-related requests
 */

class ProductController {
  // Public: Get all products
  async getProducts(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = config.pagination.defaultPageSize,
        categoryId,
        category,
        isFeatured,
        featured,
        search,
        sortBy,
        sortOrder,
        sort,
        availability,
        packaging,
      } = req.query;

      const limit = Math.min(
        parseInt(pageSize),
        config.pagination.maxPageSize
      );

      const filters = {
        isPublished: true,
        limit: limit + 1, // Get one extra to check if there's next page
        categoryId: categoryId || category,
        isFeatured: featured ? featured === 'true' : (isFeatured ? isFeatured === 'true' : undefined),
        search,
        sortBy: sortBy || sort,
        sortOrder,
        availability,
        packaging,
      };

      const products = await productService.getAllProducts(filters);

      // Check if there's a next page
      const hasNextPage = products.length > limit;
      const paginatedProducts = hasNextPage ? products.slice(0, -1) : products;

      const totalItems = await productService.getProductCount({
        isPublished: true,
        categoryId,
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
        paginatedProducts,
        pagination,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Public: Get product by slug
  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const product = await productService.getProductBySlug(slug);

      return ApiResponse.success(
        res,
        product,
        'Product retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all products
  async getAdminProducts(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = config.pagination.defaultPageSize,
        categoryId,
        isPublished,
        isFeatured,
        search,
        sortBy,
        sortOrder,
      } = req.query;

      const limit = Math.min(
        parseInt(pageSize),
        config.pagination.maxPageSize
      );

      const filters = {
        limit: limit + 1,
        categoryId,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        search,
        sortBy,
        sortOrder,
      };

      const products = await productService.getAllProducts(filters);

      const hasNextPage = products.length > limit;
      const paginatedProducts = hasNextPage ? products.slice(0, -1) : products;

      const totalItems = await productService.getProductCount({
        categoryId,
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
        paginatedProducts,
        pagination,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get product by ID
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);

      return ApiResponse.success(
        res,
        product,
        'Product retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Create product
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);

      return ApiResponse.success(
        res,
        product,
        'Product created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update product
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.updateProduct(id, req.body);

      return ApiResponse.success(
        res,
        product,
        'Product updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete product
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      await productService.deleteProduct(id);

      return ApiResponse.success(
        res,
        null,
        'Product deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
