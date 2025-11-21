/**
 * API Client
 *
 * Client-side utilities for making API requests to Next.js API routes.
 * Provides a consistent interface for fetching data with error handling.
 */

// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
  statusCode?: number;
}

// ============================================================================
// Error Classes
// ============================================================================

export class ClientApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ClientApiError';
  }
}

// ============================================================================
// Fetch Wrapper
// ============================================================================

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ClientApiError(
        response.status,
        data.error?.message || 'An error occurred',
        data.error?.code,
        data.error?.details
      );
    }

    if (!data.success) {
      throw new ClientApiError(
        response.status,
        data.error?.message || 'Request failed',
        data.error?.code,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ClientApiError(
        0,
        'Network error: Unable to connect to server',
        'NETWORK_ERROR'
      );
    }

    // Re-throw ClientApiError
    if (error instanceof ClientApiError) {
      throw error;
    }

    // Handle unknown errors
    throw new ClientApiError(
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
}

// ============================================================================
// API Client Methods
// ============================================================================

export const apiClient = {
  /**
   * GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await apiFetch<T>(url, {
      ...options,
      method: 'GET',
    });
    return response.data as T;
  },

  /**
   * POST request
   */
  async post<T>(
    url: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await apiFetch<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data as T;
  },

  /**
   * PUT request
   */
  async put<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await apiFetch<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data as T;
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await apiFetch<T>(url, {
      ...options,
      method: 'DELETE',
    });
    return response.data as T;
  },
};
