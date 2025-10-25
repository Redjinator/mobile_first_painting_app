'use client';

import { useState, useEffect } from 'react';
import { getActiveWorkers } from '@/lib/api-client/time-entries';
import { getAllJobSites } from '@/lib/api-client/job-sites';

interface ActiveWorker {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  jobSiteId: string;
  jobSiteName: string;
  floorId?: string | null;
  floorName?: string | null;
  areaId?: string | null;
  areaName?: string | null;
  clockIn: Date;
  currentHours: number;
}

interface ActiveWorkersCardProps {
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
  refreshKey: number;
}

export function ActiveWorkersCard({
  selectedSite,
  onSiteChange,
  refreshKey,
}: ActiveWorkersCardProps) {
  const [workers, setWorkers] = useState<ActiveWorker[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedSite, refreshKey]);

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      const data = await getAllJobSites();
      setSites(data);
    } catch (err) {
      console.error('Failed to load sites:', err);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveWorkers(selectedSite || undefined);
      setWorkers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load active workers');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-gray-900">
            Active Workers ({workers.length})
          </h2>
        </div>

        {/* Site Filter */}
        <select
          value={selectedSite}
          onChange={(e) => onSiteChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sites</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No workers currently clocked in
            {selectedSite && ' at this site'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => (
            <div
              key={worker.userId}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {worker.firstName} {worker.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{worker.jobSiteName}</p>
                  {worker.floorName && (
                    <p className="text-xs text-gray-500">Floor: {worker.floorName}</p>
                  )}
                  {worker.areaName && (
                    <p className="text-xs text-gray-500">Area: {worker.areaName}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Clock In:{' '}
                    {new Date(worker.clockIn).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {worker.currentHours.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">hours</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
