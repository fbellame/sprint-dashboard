/**
 * API Utility Functions
 *
 * Common utilities for API routes including error handling,
 * response formatting, and validation helpers.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public errors?: ZodError['issues']
  ) {
    super(400, message, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    super(
      404,
      id ? `${resource} with id ${id} not found` : `${resource} not found`,
      'NOT_FOUND'
    );
    this.name = 'NotFoundError';
  }
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  error: Error | ApiError | unknown,
  defaultStatus = 500
) {
  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.issues,
        },
      },
      { status: 400 }
    );
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: 'INTERNAL_ERROR',
      },
    },
    { status: defaultStatus }
  );
}

/**
 * Wrap an API handler with error handling
 */
export function withErrorHandling(
  handler: (request: Request, context?: unknown) => Promise<Response>
) {
  return async (request: Request, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      return errorResponse(error);
    }
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Parse and validate request body with Zod schema
 */
export async function parseBody<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid request body', error.issues);
    }
    throw new ValidationError('Failed to parse request body');
  }
}

/**
 * Get query parameter
 */
export function getQueryParam(request: Request, key: string): string | null {
  const url = new URL(request.url);
  return url.searchParams.get(key);
}

/**
 * Get all query parameters
 */
export function getQueryParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

// ============================================================================
// Pagination Helpers
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Parse pagination parameters from request
 */
export function parsePagination(request: Request): {
  page: number;
  limit: number;
  offset: number;
} {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// ============================================================================
// ID Validation
// ============================================================================

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validate and parse UUID from request
 */
export function parseUUID(id: string, resourceName = 'Resource'): string {
  if (!isValidUUID(id)) {
    throw new ValidationError(`Invalid ${resourceName} ID format`);
  }
  return id;
}
