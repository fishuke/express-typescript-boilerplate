import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { UserController } from './modules/users/UserController';
import { ProductController } from './modules/products/ProductController';
import { errorHandler } from './middleware/errorHandler';
import { generateOpenApiSpec } from './utils/generateOpenApiSpec';

// Load environment variables
dotenv.config();

// Set up dependency injection container
useContainer(Container);

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Set up routing-controllers
useExpressServer(app, {
  routePrefix: '/api',
  controllers: [UserController, ProductController],
  validation: true,
  classTransformer: true,
  defaultErrorHandler: false, // We'll use our custom error handler
  cors: true,
  development: process.env.NODE_ENV !== 'production',
});

// Generate OpenAPI specification
const openApiSpec = generateOpenApiSpec();

// Serve OpenAPI spec as JSON
app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// Swagger UI documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// Custom error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Server is running!                                   ║
║                                                           ║
║   📍 Local:            http://localhost:${PORT}             ║
║   📚 API Docs:         http://localhost:${PORT}/api-docs    ║
║   📄 OpenAPI Spec:     http://localhost:${PORT}/api/openapi.json ║
║   ❤️  Health Check:     http://localhost:${PORT}/health      ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}${' '.repeat(42 - (process.env.NODE_ENV || 'development').length)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
