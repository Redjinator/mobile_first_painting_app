import { NextRequest } from 'next/server';
import { jobSiteService } from '@/services/jobSiteService';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/response';
import { validateRequestBody, validateQueryParams } from '@/lib/api/validation';
import { requireAuth, requireRole } from '@/lib/api/auth';
import { createJobSiteSchema, jobSiteFiltersSchema } from '@/lib/validations/jobSite';
import { UserRole } from '@prisma/client';

/**
 * GET /api/job-sites
 * Get all job sites with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      supervisorId: searchParams.get('supervisorId') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      startDateFrom: searchParams.get('startDateFrom') ? new Date(searchParams.get('startDateFrom')!) : undefined,
      startDateTo: searchParams.get('startDateTo') ? new Date(searchParams.get('startDateTo')!) : undefined,
      minCompletion: searchParams.get('minCompletion') ? parseInt(searchParams.get('minCompletion')!) : undefined,
      maxCompletion: searchParams.get('maxCompletion') ? parseInt(searchParams.get('maxCompletion')!) : undefined,
    };

    // Validate filters
    const validatedFilters = validateQueryParams(jobSiteFiltersSchema, filters);

    // Get job sites with role-based filtering
    const jobSites = await jobSiteService.getAllJobSites(
      validatedFilters,
      user.id,
      user.role
    );

    return successResponse(jobSites);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * POST /api/job-sites
 * Create a new job site (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.ADMIN);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateRequestBody(createJobSiteSchema, body);

    // Create job site
    const jobSite = await jobSiteService.createJobSite(
      validatedData,
      user.id
    );

    return successResponse(jobSite, 'Job site created successfully', 201);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
