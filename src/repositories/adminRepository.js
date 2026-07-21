const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Admin Repository
 * Database operations for administrators
 */

class AdminRepository {
  constructor() {
    this.collection = db.collection(config.collections.administrators);
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

  async findByEmail(email) {
    try {
      const snapshot = await this.collection
        .where('email', '==', email)
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

  async updateLastLogin(id) {
    try {
      await this.collection.doc(id).update({
        lastLoginAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminRepository();
