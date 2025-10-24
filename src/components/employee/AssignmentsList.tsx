'use client';

import Link from 'next/link';
import type { Assignment } from '@/lib/api-client/employee';

interface AssignmentsListProps {
  assignments: Assignment[];
}

export function AssignmentsList({ assignments }: AssignmentsListProps) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Assignments</h3>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">No assignments yet.</p>
          <p className="text-xs mt-1">Check back later or contact your supervisor.</p>
        </div>
      </div>
    );
  }

  // Group assignments by job site
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const siteId = assignment.jobSite?.id || 'unknown';
    if (!acc[siteId]) {
      acc[siteId] = {
        site: assignment.jobSite,
        assignments: [],
      };
    }
    acc[siteId].assignments.push(assignment);
    return acc;
  }, {} as Record<string, { site: Assignment['jobSite']; assignments: Assignment[] }>);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Assignments</h3>

      <div className="space-y-4">
        {Object.values(groupedAssignments).map((group) => {
          if (!group.site) return null;

          const progressColor =
            group.site.completionPercentage >= 75
              ? 'bg-green-500'
              : group.site.completionPercentage >= 50
              ? 'bg-blue-500'
              : group.site.completionPercentage >= 25
              ? 'bg-yellow-500'
              : 'bg-gray-400';

          return (
            <div
              key={group.site.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900">{group.site.name}</h4>
                <p className="text-sm text-gray-600">{group.site.address}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {group.site.completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${progressColor}`}
                    style={{ width: `${group.site.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Assignment Details */}
              <div className="space-y-1 mb-3">
                {group.assignments.map((assignment) => (
                  <div key={assignment.id} className="text-xs text-gray-600">
                    <span className="font-medium">
                      {assignment.assignableType === 'JOB_SITE' && '📍 Entire Site'}
                      {assignment.assignableType === 'FLOOR' &&
                        `🏢 ${assignment.floor?.name || 'Floor'}`}
                      {assignment.assignableType === 'AREA' &&
                        `🚪 ${assignment.area?.name || 'Area'}`}
                    </span>
                    {assignment.assignableType === 'AREA' && assignment.area && (
                      <span className="ml-2">({assignment.area.completionPercentage}%)</span>
                    )}
                  </div>
                ))}
              </div>

              {/* View Details Link */}
              <Link
                href={`/employee/job-sites/${group.site.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
