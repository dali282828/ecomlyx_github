import { NextApiRequest, NextApiResponse } from 'next';

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Business Website Builder API',
    version: '1.0.0',
    description: 'API for building and managing business websites',
    contact: {
      name: 'API Support',
      email: 'support@businesswebsitebuilder.com',
    },
  },
  servers: [
    {
      url: process.env.APP_URL || 'http://localhost:3000',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health Check',
        description: 'Check the health status of the application',
        tags: ['Health'],
      },
    },
  },
}; 