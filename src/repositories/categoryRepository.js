const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Category Repository
 * Database operations for categories
 */

class CategoryRepository {
  constructor() {
    this.collection = db.collection(config.collections.categories);
  }

  async findAll(filters = {}) {
    try {
      let query = this.collection;

      // WORKAROUND: To avoid Firestore composite index requirement,
      // fetch all documents and filter/sort in memory
      // For production, create the composite index or use Algolia

      // If filtering by isPublished, use a simple where clause
      // If NOT filtering (admin view), fetch all categories
      if (filters.isPublished !== undefined) {
        query = query.where('isPublished', '==', filters.isPublished);
      }

      // Don't add orderBy here to avoid index requirement
      // We'll sort in memory instead

      const snapshot = await query.get();

      let categories = [];
      snapshot.forEach(doc => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Apply search filter if needed
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        categories = categories.filter(cat =>
          cat.name.toLowerCase().includes(searchLower) ||
          (cat.description && cat.description.toLowerCase().includes(searchLower))
        );
      }

      // Sort in memory by createdAt (descending)
      categories.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      // Apply pagination limit if specified
      if (filters.limit) {
        categories = categories.slice(0, filters.limit);
      }

      return categories;
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

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CategoryRepository();
