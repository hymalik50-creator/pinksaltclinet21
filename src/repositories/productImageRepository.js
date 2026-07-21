const { db, FieldValue } = require('../config/firebase');
const config = require('../config');

/**
 * Product Image Repository
 * Database operations for product images
 */

class ProductImageRepository {
  constructor() {
    this.collection = db.collection(config.collections.productImages);
  }

  async findByProductId(productId) {
    try {
      const snapshot = await this.collection
        .where('productId', '==', productId)
        .orderBy('isPrimary', 'desc')
        .orderBy('createdAt', 'asc')
        .get();

      const images = [];
      snapshot.forEach(doc => {
        images.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return images;
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

  async deleteByProductId(productId) {
    try {
      const snapshot = await this.collection
        .where('productId', '==', productId)
        .get();

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async setPrimary(imageId, productId) {
    try {
      const batch = db.batch();

      // Remove primary flag from all images
      const snapshot = await this.collection
        .where('productId', '==', productId)
        .get();

      snapshot.forEach(doc => {
        batch.update(doc.ref, { isPrimary: false });
      });

      // Set new primary
      const imageRef = this.collection.doc(imageId);
      batch.update(imageRef, { isPrimary: true });

      await batch.commit();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductImageRepository();
