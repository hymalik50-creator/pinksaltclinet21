const contactRepository = require('../repositories/contactRepository');
const { NotFoundError } = require('../utils/errors');

/**
 * Contact Service
 * Business logic for contact form submissions
 */

class ContactService {
  async getAllMessages(filters = {}) {
    try {
      return await contactRepository.findAll(filters);
    } catch (error) {
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      const message = await contactRepository.findById(id);

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  async createMessage(data) {
    try {
      const messageData = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message,
      };

      return await contactRepository.create(messageData);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const message = await contactRepository.findById(id);

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      return await contactRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getMessageCount() {
    try {
      return await contactRepository.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContactService();
