const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Product Repository
 * Database operations for products
 */

class ProductRepository {
  constructor() {
    this.collection = db.collection(config.collections.products);
  }

  async findAll(filters = {}) {
    try {
      let query = this.collection;

      // For queries with where + orderBy on different fields, we need to choose one
      // Priority: filtering > sorting (to avoid index requirements)
      
      const hasFilters = filters.isPublished !== undefined || 
                        filters.isFeatured !== undefined || 
                        filters.categoryId;

      // Apply filters
      if (filters.isPublished !== undefined) {
        query = query.where('isPublished', '==', filters.isPublished);
      }

      if (filters.isFeatured !== undefined) {
        query = query.where('isFeatured', '==', filters.isFeatured);
      }

      if (filters.categoryId) {
        query = query.where('categoryId', '==', filters.categoryId);
      }

      // Only add orderBy if no filters are applied (to avoid requiring composite index)
      // With filters, we'll sort in memory after fetching
      if (!hasFilters) {
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder || 'desc';
        query = query.orderBy(sortBy, sortOrder);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.startAfter) {
        const startDoc = await this.collection.doc(filters.startAfter).get();
        query = query.startAfter(startDoc);
      }

      const snapshot = await query.get();

      let products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // If we had filters, sort in memory
      if (hasFilters) {
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder || 'desc';
        
        products.sort((a, b) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];
          
          if (!aVal || !bVal) return 0;
          
          // Handle timestamp objects
          const aTime = aVal?.toMillis ? aVal.toMillis() : new Date(aVal).getTime();
          const bTime = bVal?.toMillis ? bVal.toMillis() : new Date(bVal).getTime();
          
          return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
        });
      }

      // Apply search filter if needed (client-side for Firestore)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.shortDescription && product.shortDescription.toLowerCase().includes(searchLower))
        );
      }

      // Apply limit after sorting if we sorted in memory
      if (hasFilters && filters.limit) {
        products = products.slice(0, filters.limit);
      }

      return products;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug) {
    try {
      const snapshot = await this.collection
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const docRef = await this.collection.add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return await this.findById(docRef.id);
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async count(filters = {}) {
    try {
      let query = this.collection;

      if (filters.isPublished !== undefined) {
        query = query.where('isPublished', '==', filters.isPublished);
      }

      if (filters.categoryId) {
        query = query.where('categoryId', '==', filters.categoryId);
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductRepository();
