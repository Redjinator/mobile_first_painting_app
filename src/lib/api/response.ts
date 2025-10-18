import { NextResponse } from 'next/server';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

// Success response helper
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

// Error response helper
export function errorResponse(
  message: string,
  code: string,
  statusCode: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status: statusCode }
  );
}

// Paginated response helper
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

// Created response helper
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201);
}

// No content response helper
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
