const productRepository = require('../repositories/productRepository');
const productImageRepository = require('../repositories/productImageRepository');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { slugify } = require('../utils/slugify');

/**
 * Product Service
 * Business logic for product management
 */

class ProductService {
  async getAllProducts(filters = {}) {
    try {
      const products = await productRepository.findAll(filters);

      // Try to fetch images for each product, but fall back to product.images if productImages query fails
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          try {
            const images = await productImageRepository.findByProductId(product.id);
            return {
              ...product,
              images: images.length > 0 ? images : (product.images || []),
            };
          } catch (error) {
            // If index doesn't exist, use images stored directly in product
            return {
              ...product,
              images: product.images || [],
            };
          }
        })
      );

      return productsWithImages;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productRepository.findById(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Try to fetch product images from separate collection, fall back to inline images
      try {
        const images = await productImageRepository.findByProductId(id);
        return {
          ...product,
          images: images.length > 0 ? images : (product.images || []),
        };
      } catch (error) {
        // If index doesn't exist, use images stored directly in product
        return {
          ...product,
          images: product.images || [],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getProductBySlug(slug) {
    try {
      const product = await productRepository.findBySlug(slug);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Try to fetch product images from separate collection, fall back to inline images
      try {
        const images = await productImageRepository.findByProductId(product.id);
        return {
          ...product,
          images: images.length > 0 ? images : (product.images || []),
        };
      } catch (error) {
        // If index doesn't exist, use images stored directly in product
        return {
          ...product,
          images: product.images || [],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async createProduct(data) {
    try {
      // Generate slug
      const slug = data.slug || slugify(data.name);

      // Check if slug exists
      const existingProduct = await productRepository.findBySlug(slug);
      if (existingProduct) {
        throw new ConflictError('Product with this name already exists');
      }

      // Handle categoryId - if category name is provided, we'll use it as categoryId for now
      const categoryId = data.categoryId || data.category || '';

      // Create product with images stored inline
      const productData = {
        name: data.name,
        slug,
        categoryId: categoryId,
        category: data.category || categoryId,
        shortDescription: data.shortDescription || '',
        description: data.description || data.fullDescription || '',
        fullDescription: data.fullDescription || data.description || '',
        sizes: data.sizes || [],
        packaging: data.packaging || [],
        minimumOrderQuantity: data.minimumOrderQuantity || '',
        origin: data.origin || '',
        usage: data.usage || '',
        specifications: data.specifications || {},
        availability: typeof data.availability === 'boolean' ? data.availability : (data.availability === 'in-stock' || data.availability === 'made-to-order'),
        isFeatured: data.featured !== undefined ? data.featured : (data.isFeatured || false),
        isPublished: data.published !== undefined ? data.published : (data.isPublished !== undefined ? data.isPublished : true),
        metaTitle: data.metaTitle || data.name,
        metaDescription: data.metaDescription || data.shortDescription,
        keywords: data.keywords || [],
        images: data.images || [], // Store images directly in product document
        exportInformation: data.exportInformation || '',
      };

      const product = await productRepository.create(productData);

      // Also try to create in productImages collection for backwards compatibility (will fail silently if index doesn't exist)
      if (data.images && data.images.length > 0) {
        try {
          for (let i = 0; i < data.images.length; i++) {
            await productImageRepository.create({
              productId: product.id,
              ...data.images[i],
              isPrimary: i === 0,
            });
          }
        } catch (error) {
          // Silently fail if index doesn't exist - images are already stored in product document
          console.log('Note: productImages collection requires Firestore index. Using inline images.');
        }
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, data) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Generate new slug if name changed
      let slug = product.slug;
      if (data.name && data.name !== product.name) {
        slug = slugify(data.name);

        const existingProduct = await productRepository.findBySlug(slug);
        if (existingProduct && existingProduct.id !== id) {
          throw new ConflictError('Product with this name already exists');
        }
      }

      const updateData = {
        ...data,
        slug,
      };

      return await productRepository.update(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Delete product images
      await productImageRepository.deleteByProductId(id);

      // Delete product
      return await productRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getProductCount(filters = {}) {
    try {
      return await productRepository.count(filters);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
