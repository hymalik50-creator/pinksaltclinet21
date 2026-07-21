const imageService = require('../services/imageService');
const ApiResponse = require('../utils/response');

/**
 * Image Controller
 * Handles image upload requests
 */

class ImageController {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(
          res,
          'No file provided',
          400
        );
      }

      // Validate image file
      imageService.validateImageFile(req.file);

      // Upload to ImgBB
      const result = await imageService.uploadToImgBB(req.file);

      return ApiResponse.success(
        res,
        result,
        'Image uploaded successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImageController();
