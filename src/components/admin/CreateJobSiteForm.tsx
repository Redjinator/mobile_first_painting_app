'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Supervisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function CreateJobSiteForm() {
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    supervisorId: '',
    startDate: new Date().toISOString().split('T')[0],
    estimatedEndDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupervisors();
  }, []);

  async function loadSupervisors() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to load supervisors');

      const data = await response.json();
      if (data.success) {
        // Filter for active supervisors and admins
        setSupervisors(
          data.data.filter(
            (u: any) => u.isActive && (u.role === 'SUPERVISOR' || u.role === 'ADMIN')
          )
        );
      }
    } catch (err) {
      console.error('Failed to load supervisors:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/job-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to create job site');
      }

      const data = await response.json();
      router.push(`/admin/job-sites/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job site');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Link href="/admin" className="text-blue-600 text-sm mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Job Site</h1>
        <p className="text-sm text-gray-600">Set up a new painting project</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Downtown Office Building"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, City, ST 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor *
                </label>
                <select
                  required
                  value={formData.supervisorId}
                  onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a supervisor...</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.firstName} {supervisor.lastName} ({supervisor.email})
                    </option>
                  ))}
                </select>
                {supervisors.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No supervisors found. Create a supervisor user first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated End Date
                </label>
                <input
                  type="date"
                  value={formData.estimatedEndDate}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedEndDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional project details, special requirements, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Job Site'}
            </button>
          </div>
        </form>
      </div>

      {/* Next Steps Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps</h3>
        <p className="text-sm text-blue-700">
          After creating the job site, you&apos;ll be able to add floors, areas, and tasks to
          organize the project.
        </p>
      </div>
    </div>
  );
}
