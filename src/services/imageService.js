const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');
const { ValidationError, InternalServerError } = require('../utils/errors');

/**
 * Image Service
 * Business logic for image upload to ImgBB
 */

class ImageService {
  async uploadToImgBB(file) {
    try {
      if (!file) {
        throw new ValidationError('No file provided');
      }

      if (!config.imgbb.apiKey) {
        throw new InternalServerError('ImgBB API key not configured');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));

      // Upload to ImgBB
      const response = await axios.post(
        `${config.imgbb.apiUrl}?key=${config.imgbb.apiKey}`,
        formData,
        {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      if (!response.data || !response.data.success) {
        throw new InternalServerError('Image upload failed');
      }

      const imageData = response.data.data;

      return {
        imageUrl: imageData.url,
        displayUrl: imageData.display_url,
        thumbnailUrl: imageData.thumb?.url || imageData.url,
        deleteUrl: imageData.delete_url,
        imageId: imageData.id,
        size: imageData.size,
        width: imageData.width,
        height: imageData.height,
      };
    } catch (error) {
      if (error.response) {
        throw new InternalServerError(
          `ImgBB error: ${error.response.data?.error?.message || 'Upload failed'}`
        );
      }
      throw error;
    }
  }

  validateImageFile(file) {
    if (!file) {
      throw new ValidationError('No file provided');
    }

    // Check file size
    if (file.size > config.upload.maxFileSize) {
      throw new ValidationError(
        `File size exceeds maximum allowed size of ${config.upload.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check file type
    if (!config.upload.allowedTypes.includes(file.mimetype)) {
      throw new ValidationError(
        `Invalid file type. Allowed: ${config.upload.allowedTypes.join(', ')}`
      );
    }

    return true;
  }
}

module.exports = new ImageService();
