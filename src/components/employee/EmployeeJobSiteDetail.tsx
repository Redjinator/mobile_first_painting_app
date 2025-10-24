'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobSiteHierarchy, type JobSiteWithHierarchy } from '@/lib/api-client/job-sites';

interface EmployeeJobSiteDetailProps {
  jobSiteId: string;
  userId: string;
}

export function EmployeeJobSiteDetail({ jobSiteId, userId }: EmployeeJobSiteDetailProps) {
  const [jobSite, setJobSite] = useState<JobSiteWithHierarchy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobSiteId]);

  async function loadJobSite() {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobSiteHierarchy(jobSiteId);
      setJobSite(data);
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

  if (error || !jobSite) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error || 'Job site not found'}</p>
          <Link href="/employee" className="text-sm text-red-800 underline mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Link href="/employee" className="text-blue-600 text-sm mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{jobSite.name}</h1>
        <p className="text-sm text-gray-600">{jobSite.address}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Overall Progress</span>
            <span className="text-xs font-semibold text-gray-900">
              {jobSite.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                jobSite.completionPercentage >= 75
                  ? 'bg-green-500'
                  : jobSite.completionPercentage >= 50
                  ? 'bg-blue-500'
                  : jobSite.completionPercentage >= 25
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
              style={{ width: `${jobSite.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floors and Tasks */}
      {jobSite.floors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
          <p className="text-sm">No floors or tasks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobSite.floors.map((floor) => (
            <div key={floor.id} className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-1">{floor.name}</h2>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-gray-900">
                  {floor.completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    floor.completionPercentage >= 75
                      ? 'bg-green-500'
                      : floor.completionPercentage >= 50
                      ? 'bg-blue-500'
                      : floor.completionPercentage >= 25
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${floor.completionPercentage}%` }}
                />
              </div>

              {/* Areas */}
              {floor.areas.length === 0 ? (
                <p className="text-xs text-gray-500">No areas in this floor.</p>
              ) : (
                <div className="space-y-3">
                  {floor.areas.map((area) => (
                    <div key={area.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{area.name}</h3>
                        <span className="text-xs font-semibold text-gray-700">
                          {area.completionPercentage}%
                        </span>
                      </div>

                      {/* Tasks */}
                      {area.tasks.length === 0 ? (
                        <p className="text-xs text-gray-500">No tasks in this area.</p>
                      ) : (
                        <div className="space-y-2">
                          {area.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-gray-50 rounded p-2 flex items-center justify-between"
                            >
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-800">
                                  {task.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {task.taskType}
                                </p>
                              </div>
                              <div className="text-right ml-2">
                                <div
                                  className={`text-xs font-bold ${
                                    task.completionPercentage === 100
                                      ? 'text-green-600'
                                      : task.completionPercentage >= 50
                                      ? 'text-blue-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {task.completionPercentage}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
