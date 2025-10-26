'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditJobSiteModalProps {
  site: {
    id: string;
    name: string;
    address: string;
    notes: string | null;
    supervisorId: string | null;
    startDate: Date;
  };
  onClose: () => void;
  onSuccess: () => void;
}

interface EditJobSiteFormData {
  name: string;
  address: string;
  notes?: string;
  supervisorId: string;
  startDate: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function EditJobSiteModal({ site, onClose, onSuccess }: EditJobSiteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditJobSiteFormData>({
    defaultValues: {
      name: site.name,
      address: site.address,
      notes: site.notes || '',
      supervisorId: site.supervisorId || '',
      startDate: site.startDate ? new Date(site.startDate).toISOString().split('T')[0] : '',
    },
  });

  // Load supervisors
  useEffect(() => {
    loadSupervisors();
  }, []);

  async function loadSupervisors() {
    try {
      setLoadingSupervisors(true);
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to load users');

      const data = await response.json();
      // Filter for admins and supervisors
      const supervisorUsers = data.data.filter(
        (user: User) => user.role === 'ADMIN' || user.role === 'SUPERVISOR'
      );
      setSupervisors(supervisorUsers);
    } catch (err) {
      console.error('Failed to load supervisors:', err);
      setError('Failed to load supervisors list');
    } finally {
      setLoadingSupervisors(false);
    }
  }

  const onSubmit = async (data: EditJobSiteFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/job-sites/${site.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          notes: data.notes || null,
          supervisorId: data.supervisorId || null,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update job site');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update job site:', err);
      setError(err instanceof Error ? err.message : 'Failed to update job site');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Job Site</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
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
                <p className="ml-3 text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Job Site Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Job Site Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Job site name is required',
                maxLength: {
                  value: 255,
                  message: 'Name must be less than 255 characters',
                },
              })}
              className={`block w-full rounded-lg border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., Riverside Apartments"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              id="address"
              type="text"
              {...register('address', {
                required: 'Address is required',
                maxLength: {
                  value: 500,
                  message: 'Address must be less than 500 characters',
                },
              })}
              className={`block w-full rounded-lg border ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., 123 Main Street, City, State 12345"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Supervisor */}
          <div>
            <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor
            </label>
            {loadingSupervisors ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading supervisors...
              </div>
            ) : (
              <select
                id="supervisorId"
                {...register('supervisorId')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No supervisor assigned</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.firstName} {supervisor.lastName} ({supervisor.role})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              {...register('notes', {
                maxLength: {
                  value: 1000,
                  message: 'Notes must be less than 1000 characters',
                },
              })}
              className={`block w-full rounded-lg border ${
                errors.notes ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Additional notes about this job site..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingSupervisors}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
