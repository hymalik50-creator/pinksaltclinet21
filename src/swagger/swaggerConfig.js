const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config');

/**
 * Swagger Configuration
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Himalayan Pink Salt Products API',
      version: '1.0.0',
      description: 'Production-ready backend API for Himalayan Pink Salt Products catalogue website',
      contact: {
        name: 'API Support',
        email: 'support@himalayansalt.com',
      },
    },
    servers: [
      {
        url: config.server.apiBaseUrl,
        description: config.server.env === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token (Admin only)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            categoryId: { type: 'string' },
            shortDescription: { type: 'string' },
            fullDescription: { type: 'string' },
            sizes: {
              type: 'array',
              items: { type: 'string' },
            },
            packaging: {
              type: 'array',
              items: { type: 'string' },
            },
            minimumOrderQuantity: { type: 'string' },
            origin: { type: 'string' },
            usage: { type: 'string' },
            specifications: { type: 'object' },
            availability: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            isPublished: { type: 'boolean' },
            metaTitle: { type: 'string' },
            metaDescription: { type: 'string' },
            keywords: {
              type: 'array',
              items: { type: 'string' },
            },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/ProductImage' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductImage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            imageUrl: { type: 'string' },
            displayUrl: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            deleteUrl: { type: 'string' },
            altText: { type: 'string' },
            isPrimary: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            isPublished: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Public - Products',
        description: 'Public product endpoints',
      },
      {
        name: 'Public - Categories',
        description: 'Public category endpoints',
      },
      {
        name: 'Public - Inquiries',
        description: 'Product inquiry endpoints',
      },
      {
        name: 'Public - Contact',
        description: 'Contact form endpoints',
      },
      {
        name: 'Admin - Auth',
        description: 'Admin authentication',
      },
      {
        name: 'Admin - Products',
        description: 'Admin product management',
      },
      {
        name: 'Admin - Categories',
        description: 'Admin category management',
      },
      {
        name: 'Admin - Images',
        description: 'Image upload management',
      },
      {
        name: 'Admin - Inquiries',
        description: 'Admin inquiry management',
      },
      {
        name: 'Admin - Contact',
        description: 'Admin contact message management',
      },
    ],
  },
  apis: ['./src/swagger/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
