import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as fs from 'fs';
import * as path from 'path';
import { UserController } from '../modules/users/UserController';
import { ProductController } from '../modules/products/ProductController';

/**
 * Generate OpenAPI specification from routing-controllers metadata
 */
export function generateOpenApiSpec(): ReturnType<typeof routingControllersToSpec> {
  const storage = getMetadataArgsStorage();

  // Generate schemas from class-validator metadata
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
    classTransformerMetadataStorage: undefined,
  });

  // Generate OpenAPI spec
  const spec = routingControllersToSpec(
    storage,
    {
      routePrefix: '/api',
      controllers: [UserController, ProductController],
    },
    {
      openapi: '3.0.0',
      info: {
        title: 'Express TypeScript API',
        description:
          'Production-ready Express.js REST API built with TypeScript, TypeDI, routing-controllers, class-validator, and OpenAPI documentation. Features automatic validation, dependency injection, and auto-generated client SDK.',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.example.com',
          description: 'Production server',
        },
      ],
      components: {
        schemas: schemas as any,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        {
          name: 'User',
          description: 'User management endpoints',
        },
        {
          name: 'Product',
          description: 'Product management endpoints',
        },
      ],
    }
  );

  return spec;
}

/**
 * Generate and save OpenAPI spec to file
 * This function can be run separately to generate the spec file for Kubb
 */
export function saveOpenApiSpec() {
  const spec = generateOpenApiSpec();
  const outputDir = path.join(process.cwd(), 'openapi');
  const outputPath = path.join(outputDir, 'spec.json');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write spec to file
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));

  console.log(`✅ OpenAPI specification generated at: ${outputPath}`);
  return outputPath;
}

// If this file is run directly, generate and save the spec
if (require.main === module) {
  saveOpenApiSpec();
}
