import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { successResponse } from '@/lib/api/utils';
import { handleApiError } from '@/lib/api/errors';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { jobSiteService } from '@/services/jobSiteService';

/**
 * POST /api/admin/clock-out/[timeEntryId]
 * Admin/Supervisor clock out a worker
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ timeEntryId: string }> }
) {
  try {
    const user = await requireAuth();
    const { timeEntryId } = await params;

    // Admin or Supervisor only
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERVISOR) {
      return NextResponse.json(
        { error: 'Only administrators and supervisors can clock out workers' },
        { status: 403 }
      );
    }

    // Get the time entry
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        jobSite: {
          select: {
            id: true,
            name: true,
            supervisorId: true,
          },
        },
      },
    });

    if (!timeEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    // Check if already clocked out
    if (timeEntry.clockOut) {
      return NextResponse.json(
        { error: 'Worker is already clocked out' },
        { status: 400 }
      );
    }

    // Supervisors can only clock out workers at their own sites
    if (user.role === UserRole.SUPERVISOR && timeEntry.jobSite.supervisorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only clock out workers at sites you supervise' },
        { status: 403 }
      );
    }

    // Clock out the worker
    const now = new Date();
    const clockIn = new Date(timeEntry.clockIn);
    const totalHours = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    const updatedEntry = await prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: {
        clockOut: now,
        totalHours: Math.round(totalHours * 100) / 100,
      },
    });

    // Update job site active status (check if any other painters are still clocked in)
    await jobSiteService.updateActiveStatus(timeEntry.jobSite.id);

    return successResponse(
      updatedEntry,
      `Successfully clocked out ${timeEntry.user.firstName} ${timeEntry.user.lastName}`
    );
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
