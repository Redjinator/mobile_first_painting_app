'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  getUserAssignments,
  getCurrentTimeEntry,
  getTodayHours,
  type Assignment,
  type TimeEntry,
  type TodayHours,
} from '@/lib/api-client/employee';
import { TimeTracker } from './TimeTracker';
import { AssignmentsList } from './AssignmentsList';
import { TodayStats } from './TodayStats';

interface EmployeeDashboardProps {
  userId: string;
}

export function EmployeeDashboard({ userId }: EmployeeDashboardProps) {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [todayHours, setTodayHours] = useState<TodayHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, currentEntryData, hoursData] = await Promise.all([
        getUserAssignments(userId),
        getCurrentTimeEntry(),
        getTodayHours(userId),
      ]);
      setAssignments(assignmentsData);
      setCurrentEntry(currentEntryData);
      setTodayHours(hoursData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <button
              onClick={loadDashboardData}
              className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {session?.user?.firstName}!
        </h2>
        <p className="text-green-100">Ready to paint today?</p>
      </div>

      {/* Time Tracker */}
      <TimeTracker
        currentEntry={currentEntry}
        assignments={assignments}
        onUpdate={loadDashboardData}
      />

      {/* Today's Stats */}
      <TodayStats todayHours={todayHours} />

      {/* Assignments */}
      <AssignmentsList assignments={assignments} />
    </div>
  );
}
