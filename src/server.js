require('dotenv').config();
const app = require('./app');
const config = require('./config');

/**
 * Server Initialization
 */

const PORT = config.server.port;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🏔️  Himalayan Pink Salt Backend API                        ║
║                                                               ║
║   Environment: ${config.server.env.toUpperCase().padEnd(47)} ║
║   Port: ${PORT.toString().padEnd(53)} ║
║   URL: ${config.server.apiBaseUrl.padEnd(54)} ║
║                                                               ║
║   Status: ✅ Server is running                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  if (config.server.env === 'development') {
    console.log(`📚 API Documentation: ${config.server.apiBaseUrl}/api-docs`);
    console.log(`🏥 Health Check: ${config.server.apiBaseUrl}/health`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});
