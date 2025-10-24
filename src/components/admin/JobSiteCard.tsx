'use client';

import Link from 'next/link';
import type { JobSiteWithProgress } from '@/lib/api-client/job-sites';

interface JobSiteCardProps {
  site: JobSiteWithProgress;
}

export function JobSiteCard({ site }: JobSiteCardProps) {
  const progressColor =
    site.completionPercentage >= 75
      ? 'bg-green-500'
      : site.completionPercentage >= 50
      ? 'bg-blue-500'
      : site.completionPercentage >= 25
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  const statusColor = site.isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';

  return (
    <Link href={`/admin/job-sites/${site.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {site.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 truncate">{site.address}</p>
          </div>
          <span
            className={`ml-3 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColor}`}
          >
            {site.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs font-semibold text-gray-900">
              {site.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${progressColor}`}
              style={{ width: `${site.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-gray-900">
              {site.floorCount}
            </div>
            <div className="text-xs text-gray-600">
              {site.floorCount === 1 ? 'Floor' : 'Floors'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-gray-900">
              {site.activeWorkerCount}
            </div>
            <div className="text-xs text-gray-600">
              {site.activeWorkerCount === 1 ? 'Painter' : 'Painters'}
            </div>
          </div>
        </div>

        {/* Supervisor */}
        {site.supervisor && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Supervisor</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {site.supervisor.firstName} {site.supervisor.lastName}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="mt-3 text-xs text-gray-500">
          Started {new Date(site.startDate).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
