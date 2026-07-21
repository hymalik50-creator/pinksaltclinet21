const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Inquiry Repository
 * Database operations for product inquiries
 */

class InquiryRepository {
  constructor() {
    this.collection = db.collection(config.collections.inquiries);
  }

  async findAll(filters = {}) {
    try {
      let query = this.collection;

      // Apply filters
      if (filters.productId) {
        query = query.where('productId', '==', filters.productId);
      }

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.country) {
        query = query.where('country', '==', filters.country);
      }

      // Sorting
      query = query.orderBy('createdAt', 'desc');

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.startAfter) {
        const startDoc = await this.collection.doc(filters.startAfter).get();
        query = query.startAfter(startDoc);
      }

      const snapshot = await query.get();

      const inquiries = [];
      snapshot.forEach(doc => {
        inquiries.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return inquiries;
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

  async create(data) {
    try {
      const docRef = await this.collection.add({
        ...data,
        status: 'new',
        createdAt: FieldValue.serverTimestamp(),
      });

      return await this.findById(docRef.id);
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      await this.collection.doc(id).update({
        status,
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

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InquiryRepository();
