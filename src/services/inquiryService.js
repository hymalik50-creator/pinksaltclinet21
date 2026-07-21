const inquiryRepository = require('../repositories/inquiryRepository');
const { NotFoundError } = require('../utils/errors');

/**
 * Inquiry Service
 * Business logic for product inquiries
 */

class InquiryService {
  async getAllInquiries(filters = {}) {
    try {
      return await inquiryRepository.findAll(filters);
    } catch (error) {
      throw error;
    }
  }

  async getInquiryById(id) {
    try {
      const inquiry = await inquiryRepository.findById(id);

      if (!inquiry) {
        throw new NotFoundError('Inquiry not found');
      }

      return inquiry;
    } catch (error) {
      throw error;
    }
  }

  async createInquiry(data) {
    try {
      const inquiryData = {
        productId: data.productId || null,
        customerName: data.customerName,
        companyName: data.companyName || '',
        email: data.email,
        phone: data.phone || '',
        country: data.country || '',
        quantity: data.quantity || '',
        packaging: data.packaging || '',
        message: data.message || '',
      };

      return await inquiryRepository.create(inquiryData);
    } catch (error) {
      throw error;
    }
  }

  async updateInquiryStatus(id, status) {
    try {
      const inquiry = await inquiryRepository.findById(id);

      if (!inquiry) {
        throw new NotFoundError('Inquiry not found');
      }

      // Validate status - support both old and new status values
      const validStatuses = [
        'pending', 'processing', 'completed', 'rejected',  // Backend values
        'new', 'read', 'responded', 'archived'  // Frontend values
      ];
      if (!validStatuses.includes(status)) {
        const { ValidationError } = require('../utils/errors');
        throw new ValidationError('Invalid status');
      }

      return await inquiryRepository.updateStatus(id, status);
    } catch (error) {
      throw error;
    }
  }

  async deleteInquiry(id) {
    try {
      const inquiry = await inquiryRepository.findById(id);

      if (!inquiry) {
        throw new NotFoundError('Inquiry not found');
      }

      return await inquiryRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getInquiryCount(filters = {}) {
    try {
      return await inquiryRepository.count(filters);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InquiryService();
