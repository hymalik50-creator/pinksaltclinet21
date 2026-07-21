const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Contact Message Repository
 * Database operations for contact form submissions
 */

class ContactRepository {
  constructor() {
    this.collection = db.collection(config.collections.contactMessages);
  }

  async findAll(filters = {}) {
    try {
      let query = this.collection;

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

      const messages = [];
      snapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Apply search filter if needed
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return messages.filter(msg =>
          msg.name.toLowerCase().includes(searchLower) ||
          msg.email.toLowerCase().includes(searchLower) ||
          (msg.subject && msg.subject.toLowerCase().includes(searchLower))
        );
      }

      return messages;
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
        createdAt: FieldValue.serverTimestamp(),
      });

      return await this.findById(docRef.id);
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

  async count() {
    try {
      const snapshot = await this.collection.count().get();
      return snapshot.data().count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContactRepository();
