const { AppError } = require('../utils/errors');

/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle operational errors
  if (err instanceof AppError && err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Firebase errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('auth/')) {
    statusCode = 401;
    message = 'Authentication failed';
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size too large';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    } else {
      message = 'File upload error';
    }
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON';
  }

  // Production error response
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? message : err.message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.name,
      stack: err.stack 
    }),
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
