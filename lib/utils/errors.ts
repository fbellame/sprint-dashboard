/**
 * Error Handling Utilities
 * 
 * Client-side error handling utilities for formatting and displaying errors
 * to users in a user-friendly way.
 */

import { ClientApiError } from '@/lib/api/client';

// ============================================================================
// Error Types
// ============================================================================

export interface FormattedError {
  message: string;
  code?: string;
  userMessage: string;
  isRetryable: boolean;
}

// ============================================================================
// Error Formatting
// ============================================================================

/**
 * Format an error into a user-friendly message
 */
export function formatError(error: unknown): FormattedError {
  // Handle ClientApiError
  if (error instanceof ClientApiError) {
    return {
      message: error.message,
      code: error.code,
      userMessage: getUserFriendlyMessage(error),
      isRetryable: isRetryableError(error),
    };
  }

  // Handle generic Error
  if (error instanceof Error) {
    return {
      message: error.message,
      userMessage: getUserFriendlyMessage(error),
      isRetryable: false,
    };
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred',
    userMessage: 'Something went wrong. Please try again later.',
    isRetryable: false,
  };
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error: Error | ClientApiError): string {
  // Network errors
  if (error instanceof ClientApiError && error.code === 'NETWORK_ERROR') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Validation errors
  if (error instanceof ClientApiError && error.code === 'VALIDATION_ERROR') {
    return 'Please check your input and try again.';
  }

  // Not found errors
  if (error instanceof ClientApiError && error.statusCode === 404) {
    return 'The requested resource was not found.';
  }

  // Server errors
  if (error instanceof ClientApiError && error.statusCode >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  // Permission errors
  if (error instanceof ClientApiError && error.statusCode === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Unauthorized errors
  if (error instanceof ClientApiError && error.statusCode === 401) {
    return 'Please sign in to continue.';
  }

  // Default: use error message if available
  return error.message || 'An unexpected error occurred.';
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: ClientApiError): boolean {
  // Network errors are retryable
  if (error.code === 'NETWORK_ERROR') {
    return true;
  }

  // Server errors (5xx) are retryable
  if (error.statusCode >= 500) {
    return true;
  }

  // Client errors (4xx) are generally not retryable
  return false;
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error to console (and potentially to error tracking service)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const formattedError = formatError(error);

  console.error('Error:', {
    message: formattedError.message,
    code: formattedError.code,
    context,
    originalError: error,
  });

  // TODO: Integrate with error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
}

// ============================================================================
// Error Display Helpers
// ============================================================================

/**
 * Get error title for display
 */
export function getErrorTitle(error: unknown): string {
  if (error instanceof ClientApiError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection Error';
      case 'VALIDATION_ERROR':
        return 'Validation Error';
      case 'NOT_FOUND':
        return 'Not Found';
      default:
        return 'Error';
    }
  }

  return 'Error';
}

/**
 * Check if error should be shown to user
 */
export function shouldShowError(error: unknown): boolean {
  // Don't show network errors that might be temporary
  if (error instanceof ClientApiError && error.code === 'NETWORK_ERROR') {
    return true; // Show network errors so user knows what's happening
  }

  // Show all other errors
  return true;
}

