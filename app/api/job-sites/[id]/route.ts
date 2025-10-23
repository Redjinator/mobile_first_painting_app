import { NextRequest } from 'next/server';
import { jobSiteService } from '@/services/jobSiteService';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/response';
import { validateRequestBody } from '@/lib/api/validation';
import { requireAuth, requireRole } from '@/lib/api/auth';
import { updateJobSiteSchema } from '@/lib/validations/jobSite';
import { UserRole } from '@prisma/client';

/**
 * GET /api/job-sites/[id]
 * Get a single job site by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const jobSite = await jobSiteService.getJobSiteById(
      id,
      user.id,
      user.role
    );

    return successResponse(jobSite);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * PATCH /api/job-sites/[id]
 * Update a job site (admin or site supervisor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateRequestBody(updateJobSiteSchema, body);

    // Update job site
    const jobSite = await jobSiteService.updateJobSite(
      id,
      validatedData as any, // Zod validated data matches the DTO
      user.id,
      user.role
    );

    return successResponse(jobSite);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * DELETE /api/job-sites/[id]
 * Soft delete a job site (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(UserRole.ADMIN);
    const { id } = await params;

    const result = await jobSiteService.deleteJobSite(
      id,
      user.id,
      user.role
    );

    return successResponse(result);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
