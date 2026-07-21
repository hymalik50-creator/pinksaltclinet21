const categoryRepository = require('../repositories/categoryRepository');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');
const { slugify } = require('../utils/slugify');

/**
 * Category Service
 * Business logic for category management
 */

class CategoryService {
  async getAllCategories(filters = {}) {
    try {
      return await categoryRepository.findAll(filters);
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      const category = await categoryRepository.findById(id);

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryBySlug(slug) {
    try {
      const category = await categoryRepository.findBySlug(slug);

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(data) {
    try {
      // Generate slug
      const slug = slugify(data.name);

      // Check if slug exists
      const existingCategory = await categoryRepository.findBySlug(slug);
      if (existingCategory) {
        throw new ConflictError('Category with this name already exists');
      }

      // Create category
      const categoryData = {
        name: data.name,
        slug,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      };

      return await categoryRepository.create(categoryData);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      // Check if category exists
      const category = await categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      // Generate new slug if name changed
      let slug = category.slug;
      if (data.name && data.name !== category.name) {
        slug = slugify(data.name);

        // Check if new slug already exists
        const existingCategory = await categoryRepository.findBySlug(slug);
        if (existingCategory && existingCategory.id !== id) {
          throw new ConflictError('Category with this name already exists');
        }
      }

      // Update category
      const updateData = {
        ...data,
        slug,
      };

      return await categoryRepository.update(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      const category = await categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      return await categoryRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getCategoryCount(filters = {}) {
    try {
      return await categoryRepository.count(filters);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CategoryService();
