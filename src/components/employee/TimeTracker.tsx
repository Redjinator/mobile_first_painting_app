'use client';

import { useState } from 'react';
import { clockIn, clockOut, type TimeEntry, type Assignment } from '@/lib/api-client/employee';

interface TimeTrackerProps {
  currentEntry: TimeEntry | null;
  assignments: Assignment[];
  onUpdate: () => void;
}

export function TimeTracker({ currentEntry, assignments, onUpdate }: TimeTrackerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('');

  async function handleClockIn() {
    if (!selectedSite) {
      setError('Please select a job site');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await clockIn({ jobSiteId: selectedSite });
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    try {
      setLoading(true);
      setError(null);
      await clockOut();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  }

  // Get unique job sites from assignments
  const jobSites = assignments
    .filter((a) => a.jobSite)
    .reduce((acc, a) => {
      if (a.jobSite && !acc.find((s) => s.id === a.jobSite!.id)) {
        acc.push(a.jobSite);
      }
      return acc;
    }, [] as NonNullable<Assignment['jobSite']>[]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracker</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {currentEntry ? (
        /* Clocked In State */
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">Currently Clocked In</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Site:</span> {currentEntry.jobSite.name}
              </p>
              {currentEntry.floor && (
                <p>
                  <span className="font-medium">Floor:</span> {currentEntry.floor.name}
                </p>
              )}
              {currentEntry.area && (
                <p>
                  <span className="font-medium">Area:</span> {currentEntry.area.name}
                </p>
              )}
              <p>
                <span className="font-medium">Clock In:</span>{' '}
                {new Date(currentEntry.clockIn).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleClockOut}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Clocking Out...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Clock Out
              </>
            )}
          </button>
        </div>
      ) : (
        /* Clock In State */
        <div className="space-y-4">
          {jobSites.length > 0 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Job Site
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a site...</option>
                  {jobSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClockIn}
                disabled={loading || !selectedSite}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Clocking In...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Clock In
                  </>
                )}
              </button>
            </>
          ) : (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No job sites assigned yet.</p>
              <p className="text-xs mt-1">Contact your supervisor for assignments.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
