'use client';

import { useState, useEffect } from 'react';
import { getAllJobSites } from '@/lib/api-client/job-sites';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

interface JobSite {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  userId: string;
  assignableType: 'JOB_SITE' | 'FLOOR' | 'AREA';
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  jobSite?: {
    id: string;
    name: string;
  };
  floor?: {
    id: string;
    name: string;
  } | null;
  area?: {
    id: string;
    name: string;
  } | null;
}

export function AssignmentManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<JobSite[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      loadAssignments();
    }
  }, [selectedSite]);

  async function loadInitialData() {
    try {
      const [usersData, sitesData] = await Promise.all([
        fetch('/api/users').then((r) => r.json()),
        getAllJobSites(),
      ]);

      if (usersData.success) {
        // Filter to only employees
        setUsers(usersData.data.filter((u: User) => u.role === 'EMPLOYEE' && u.isActive));
      }
      setSites(sitesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  async function loadAssignments() {
    try {
      setLoading(true);
      const response = await fetch(`/api/job-sites/${selectedSite}/assignments`);
      if (!response.ok) throw new Error('Failed to load assignments');

      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    if (!selectedSite || !selectedUser) {
      setError('Please select both a job site and a painter');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/job-sites/${selectedSite}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to create assignment');
      }

      setSelectedUser('');
      await loadAssignments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveAssignment(assignmentId: string) {
    if (!confirm('Are you sure you want to remove this assignment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove assignment');
      }

      await loadAssignments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove assignment');
    }
  }

  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Assign Painter to Job Site</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Site *
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a job site...</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Painter *
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={!selectedSite}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a painter...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssign}
              disabled={!selectedSite || !selectedUser || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      {selectedSite && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Current Assignments ({assignments.length})
          </h3>

          {loading && !assignments.length ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No painters assigned to this site yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {assignment.user.firstName} {assignment.user.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{assignment.user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {assignment.assignableType.replace('_', ' ')}
                      </span>
                      {assignment.floor && (
                        <span className="text-xs text-gray-500">
                          {assignment.floor.name}
                        </span>
                      )}
                      {assignment.area && (
                        <span className="text-xs text-gray-500">
                          → {assignment.area.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAssignment(assignment.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
