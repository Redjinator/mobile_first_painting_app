'use client';

import { useState, useEffect } from 'react';
import { getAllJobSites } from '@/lib/api-client/job-sites';

interface TimeEntry {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  totalHours: number | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  jobSite: {
    id: string;
    name: string;
    address: string;
  };
  floor?: {
    id: string;
    name: string;
    floorNumber: number;
  } | null;
  area?: {
    id: string;
    name: string;
    areaType: string;
  } | null;
}

interface TimeEntriesTableProps {
  selectedDate: string;
  selectedSite: string;
  onDateChange: (date: string) => void;
  onSiteChange: (siteId: string) => void;
  refreshKey: number;
}

export function TimeEntriesTable({
  selectedDate,
  selectedSite,
  onDateChange,
  onSiteChange,
  refreshKey,
}: TimeEntriesTableProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [selectedDate, selectedSite, refreshKey]);

  async function loadSites() {
    try {
      const data = await getAllJobSites();
      setSites(data);
    } catch (err) {
      console.error('Failed to load sites:', err);
    }
  }

  async function loadEntries() {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (selectedDate) {
        const date = new Date(selectedDate);
        params.append('startDate', date.toISOString());
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        params.append('endDate', endDate.toISOString());
      }
      if (selectedSite) {
        params.append('siteId', selectedSite);
      }

      const response = await fetch(`/api/time-entries?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load time entries');
      }

      const data = await response.json();
      if (data.success) {
        setEntries(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to load time entries');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load time entries');
    } finally {
      setLoading(false);
    }
  }

  const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const completedEntries = entries.filter((e) => e.clockOut !== null).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Entries</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Site
            </label>
            <select
              value={selectedSite}
              onChange={(e) => onSiteChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
            <div className="text-xs text-gray-600 mt-1">Total Entries</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalHours.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Hours</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{completedEntries}</div>
            <div className="text-xs text-gray-600 mt-1">Completed</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No time entries found for selected filters
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Worker</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Site</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Clock In
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Clock Out
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {entry.user.firstName} {entry.user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{entry.user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{entry.jobSite.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-700">
                      {entry.floor ? (
                        <>
                          {entry.floor.name}
                          {entry.area && (
                            <>
                              <br />
                              <span className="text-xs text-gray-500">
                                {entry.area.name}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">Site level</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(entry.clockIn).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {entry.clockOut ? (
                      <span className="text-gray-700">
                        {new Date(entry.clockOut).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {entry.totalHours ? (
                      <span className="font-semibold text-gray-900">
                        {entry.totalHours.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">In progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
