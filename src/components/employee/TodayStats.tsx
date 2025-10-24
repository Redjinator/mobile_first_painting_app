'use client';

import type { TodayHours } from '@/lib/api-client/employee';

interface TodayStatsProps {
  todayHours: TodayHours | null;
}

export function TodayStats({ todayHours }: TodayStatsProps) {
  if (!todayHours) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Summary</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {todayHours.totalHours.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Hours Worked</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {todayHours.completedEntries}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {todayHours.completedEntries === 1 ? 'Session' : 'Sessions'}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {todayHours.isCurrentlyClockedIn ? '✓' : '—'}
          </div>
          <div className="text-xs text-gray-600 mt-1">Clocked In</div>
        </div>
      </div>
    </div>
  );
}
