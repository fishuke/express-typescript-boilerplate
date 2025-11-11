import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: unknown;
  timestamp: string;
  path: string;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const errorResponse: ErrorResponse = {
    status: 500,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: request.path,
  };

  // Handle routing-controllers errors
  if ('httpCode' in error) {
    errorResponse.status = (error as { httpCode: number }).httpCode;
  }

  // Handle class-validator validation errors
  if (error.name === 'BadRequestError' && 'errors' in error) {
    const validationErrors = (error as { errors?: ValidationError[] }).errors;
    if (validationErrors && Array.isArray(validationErrors)) {
      errorResponse.errors = validationErrors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
    }
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: request.path,
    method: request.method,
  });

  response.status(errorResponse.status).json(errorResponse);
}
