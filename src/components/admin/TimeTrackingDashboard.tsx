'use client';

import { useState, useEffect } from 'react';
import { ActiveWorkersCard } from './ActiveWorkersCard';
import { TimeEntriesTable } from './TimeEntriesTable';

export function TimeTrackingDashboard() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSite, setSelectedSite] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Time Tracking Dashboard</h1>
        <p className="text-sm text-gray-600">
          Monitor active workers and view time entry history
        </p>
      </div>

      {/* Active Workers */}
      <ActiveWorkersCard
        selectedSite={selectedSite}
        onSiteChange={setSelectedSite}
        refreshKey={refreshKey}
      />

      {/* Time Entries Table */}
      <TimeEntriesTable
        selectedDate={selectedDate}
        selectedSite={selectedSite}
        onDateChange={setSelectedDate}
        onSiteChange={setSelectedSite}
        refreshKey={refreshKey}
      />
    </div>
  );
}
