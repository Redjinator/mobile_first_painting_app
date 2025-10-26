'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JobSiteWithProgress } from '@/lib/api-client/job-sites';

interface JobSiteCardProps {
  site: JobSiteWithProgress;
  onDelete?: (siteId: string) => void;
}

export function JobSiteCard({ site, onDelete }: JobSiteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${site.name}"? This will delete all floors, areas, tasks, and assignments associated with this job site. This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/job-sites/${site.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to delete job site');
      }

      if (onDelete) {
        onDelete(site.id);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete job site:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete job site');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 p-4 sm:p-6 relative">
      <Link href={`/admin/job-sites/${site.id}`} className="block">
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
      </Link>

      {/* Delete Button (Absolute positioned) */}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 z-10"
          title="Delete job site"
        >
          {isDeleting ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
