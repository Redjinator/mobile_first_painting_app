/**
 * API Client for frontend data fetching
 * Handles authentication, errors, and response parsing
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  message?: string;
}

/**
 * Base API client with error handling
 */
async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error?.message || 'An error occurred',
        response.status,
        data.error?.code
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      500
    );
  }
}

/**
 * GET request
 */
export async function get<T>(url: string): Promise<T> {
  return fetchApi<T>(url, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(url: string, body?: unknown): Promise<T> {
  return fetchApi<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(url: string, body?: unknown): Promise<T> {
  return fetchApi<T>(url, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  return fetchApi<T>(url, { method: 'DELETE' });
}
