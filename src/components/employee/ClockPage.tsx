'use client';

import { useState, useEffect } from 'react';
import {
  getMyAssignments,
  getCurrentTimeEntry,
  clockIn as apiClockIn,
  clockOut as apiClockOut,
  type Assignment,
  type TimeEntry,
} from '@/lib/api-client/employee';
import { getTimeEntriesForUser, type TimeEntryWithDetails } from '@/lib/api-client/time-entries';
import { useTimer } from '@/hooks/useTimer';

interface ClockPageProps {
  userId: string;
}

export function ClockPage({ userId }: ClockPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<TimeEntryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for clock in
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [notes, setNotes] = useState('');

  // Live timer for current entry
  const currentHours = useTimer(currentEntry?.clockIn);

  useEffect(() => {
    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, currentEntryData, recentEntriesData] = await Promise.all([
        getMyAssignments(),
        getCurrentTimeEntry(),
        getTimeEntriesForUser(userId),
      ]);
      setAssignments(assignmentsData);
      setCurrentEntry(currentEntryData);
      setRecentEntries(recentEntriesData.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleClockIn() {
    if (!selectedSite) {
      setError('Please select a job site');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await apiClockIn({
        jobSiteId: selectedSite,
        floorId: selectedFloor || undefined,
        areaId: selectedArea || undefined,
        notes: notes || undefined,
      });
      // Reset form
      setSelectedSite('');
      setSelectedFloor('');
      setSelectedArea('');
      setNotes('');
      // Reload data
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClockOut() {
    if (!currentEntry) return;

    try {
      setActionLoading(true);
      setError(null);
      await apiClockOut({ notes: notes || undefined });
      setNotes('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
    } finally {
      setActionLoading(false);
    }
  }

  // Get unique job sites from assignments
  const jobSites = assignments
    .filter((a) => a.jobSite)
    .map((a) => ({ id: a.jobSite!.id, name: a.jobSite!.name }))
    .filter((site, index, self) => self.findIndex((s) => s.id === site.id) === index);

  // Get floors for selected site
  const floors = assignments
    .filter((a) => a.jobSite?.id === selectedSite && a.floor)
    .map((a) => ({ id: a.floor!.id, name: a.floor!.name }))
    .filter((floor, index, self) => self.findIndex((f) => f.id === floor.id) === index);

  // Get areas for selected floor
  const areas = assignments
    .filter(
      (a) =>
        a.jobSite?.id === selectedSite &&
        a.floor?.id === selectedFloor &&
        a.area
    )
    .map((a) => ({ id: a.area!.id, name: a.area!.name }))
    .filter((area, index, self) => self.findIndex((ar) => ar.id === area.id) === index);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isClockedIn = !!currentEntry;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Time Clock</h1>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Clock In/Out Section */}
      {!isClockedIn ? (
        /* Clock In Form */
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Clock In</h2>

          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">
                You have no active assignments. Please contact your supervisor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job Site Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Site *
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => {
                    setSelectedSite(e.target.value);
                    setSelectedFloor('');
                    setSelectedArea('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a job site...</option>
                  {jobSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Selector (Optional) */}
              {selectedSite && floors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor (Optional)
                  </label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => {
                      setSelectedFloor(e.target.value);
                      setSelectedArea('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any floor</option>
                    {floors.map((floor) => (
                      <option key={floor.id} value={floor.id}>
                        {floor.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Area Selector (Optional) */}
              {selectedSite && selectedFloor && areas.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (Optional)
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any area</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Add any notes about today's work..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Clock In Button */}
              <button
                onClick={handleClockIn}
                disabled={!selectedSite || actionLoading}
                className="w-full bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {actionLoading ? 'Clocking In...' : 'Clock In'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Clocked In Status */
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
            <h2 className="text-lg font-semibold">Currently Clocked In</h2>
          </div>

          {/* Location Info */}
          <div className="space-y-2 mb-4">
            <p className="text-sm">
              <span className="font-medium">Site:</span> {currentEntry.jobSite.name}
            </p>
            {currentEntry.floor && (
              <p className="text-sm">
                <span className="font-medium">Floor:</span> {currentEntry.floor.name}
              </p>
            )}
            {currentEntry.area && (
              <p className="text-sm">
                <span className="font-medium">Area:</span> {currentEntry.area.name}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Clock In Time:</span>{' '}
              {new Date(currentEntry.clockIn).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Hours Display */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            <p className="text-sm mb-1">Hours Today</p>
            <p className="text-4xl font-bold">{currentHours.toFixed(2)}</p>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Clock Out Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Add notes about today's work..."
              className="w-full px-3 py-2 border border-white bg-white bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-200"
            />
          </div>

          {/* Clock Out Button */}
          <button
            onClick={handleClockOut}
            disabled={actionLoading}
            className="w-full bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
          >
            {actionLoading ? 'Clocking Out...' : 'Clock Out'}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      {recentEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {entry.jobSite.name}
                    {entry.floor && ` - ${entry.floor.name}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.clockIn).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {entry.totalHours ? `${entry.totalHours.toFixed(2)} hrs` : 'In Progress'}
                  </p>
                  {entry.totalHours && (
                    <p className="text-xs text-gray-500">
                      {new Date(entry.clockIn).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {entry.clockOut &&
                        new Date(entry.clockOut).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
