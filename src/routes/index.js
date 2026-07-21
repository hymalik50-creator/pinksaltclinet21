const express = require('express');
const router = express.Router();

/**
 * Main Router
 * Combines all route modules
 */

// Import route modules
const publicRoutes = require('./publicRoutes');
const adminAuthRoutes = require('./adminAuthRoutes');
const adminProductRoutes = require('./adminProductRoutes');
const adminCategoryRoutes = require('./adminCategoryRoutes');
const adminImageRoutes = require('./adminImageRoutes');
const adminInquiryRoutes = require('./adminInquiryRoutes');
const adminContactRoutes = require('./adminContactRoutes');
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middlewares/auth');

// Public routes
router.use('/api', publicRoutes);

// Health check
router.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Admin authentication routes
router.use('/api/admin', adminAuthRoutes);

// Admin protected routes
router.use('/api/admin/products', adminProductRoutes);
router.use('/api/admin/categories', adminCategoryRoutes);
router.use('/api/admin/images', adminImageRoutes);
router.use('/api/admin/inquiries', adminInquiryRoutes);
router.use('/api/admin/contact', adminContactRoutes);

// Admin stats route
router.get('/api/admin/stats', authenticate, statsController.getStats);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
