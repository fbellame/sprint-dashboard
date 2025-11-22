import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse } from '@/lib/api/client';

/**
 * API Response utilities
 * Provides consistent response formatting for API routes
 */

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: z.ZodError
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.errors,
      },
    },
    { status: 400 }
  );
}

/**
 * Not found error response
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: `${resource} not found`,
        code: 'NOT_FOUND',
      },
    },
    { status: 404 }
  );
}
