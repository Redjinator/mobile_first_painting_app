'use client';

import { useState, useEffect } from 'react';
import {
  getJobSiteById,
  getJobSiteHierarchy,
  type JobSiteWithProgress,
} from '@/lib/api-client/job-sites';
import { FloorAccordion } from './FloorAccordion';

interface JobSiteDetailProps {
  siteId: string;
}

export function JobSiteDetail({ siteId }: JobSiteDetailProps) {
  const [site, setSite] = useState<JobSiteWithProgress | null>(null);
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSiteData();
  }, [siteId]);

  async function loadSiteData() {
    try {
      setLoading(true);
      setError(null);
      const [siteData, hierarchyData] = await Promise.all([
        getJobSiteById(siteId),
        getJobSiteHierarchy(siteId),
      ]);
      setSite(siteData);
      setHierarchy(hierarchyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job site');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading job site...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading job site</h3>
            <div className="mt-2 text-sm text-red-700">{error || 'Site not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  const progressColor =
    site.completionPercentage >= 75
      ? 'bg-green-500'
      : site.completionPercentage >= 50
      ? 'bg-blue-500'
      : site.completionPercentage >= 25
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  return (
    <div className="space-y-6">
      {/* Site Header Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{site.name}</h2>
            <p className="text-gray-600 mb-4">{site.address}</p>
            {site.notes && (
              <p className="text-sm text-gray-500 italic">{site.notes}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              site.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {site.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-lg font-bold text-gray-900">
              {site.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${progressColor}`}
              style={{ width: `${site.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{site.floorCount}</div>
            <div className="text-xs text-gray-600">
              {site.floorCount === 1 ? 'Floor' : 'Floors'}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {site.activeWorkerCount}
            </div>
            <div className="text-xs text-gray-600">Active Painters</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {hierarchy?.floors?.reduce(
                (sum: number, f: any) => sum + (f.areas?.length || 0),
                0
              ) || 0}
            </div>
            <div className="text-xs text-gray-600">Areas</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {hierarchy?.floors?.reduce(
                (sum: number, f: any) =>
                  sum +
                  (f.areas?.reduce(
                    (aSum: number, a: any) => aSum + (a.tasks?.length || 0),
                    0
                  ) || 0),
                0
              ) || 0}
            </div>
            <div className="text-xs text-gray-600">Tasks</div>
          </div>
        </div>

        {/* Supervisor Info */}
        {site.supervisor && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {site.supervisor.firstName[0]}
                  {site.supervisor.lastName[0]}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Supervisor</p>
                <p className="text-sm font-medium text-gray-900">
                  {site.supervisor.firstName} {site.supervisor.lastName}
                </p>
                <p className="text-xs text-gray-500">{site.supervisor.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Started:</span>{' '}
            {new Date(site.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>{' '}
            {new Date(site.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Floors List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Floors & Progress
        </h3>
        {hierarchy?.floors && hierarchy.floors.length > 0 ? (
          <div className="space-y-3">
            {hierarchy.floors.map((floor: any) => (
              <FloorAccordion key={floor.id} floor={floor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No floors added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
