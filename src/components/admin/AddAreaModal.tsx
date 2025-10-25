'use client';

import { useState } from 'react';

interface AddAreaModalProps {
  floorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAreaModal({ floorId, onClose, onSuccess }: AddAreaModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    areaType: 'ROOM' as 'ROOM' | 'HALLWAY' | 'BATHROOM' | 'KITCHEN' | 'CLOSET' | 'OTHER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorId: floorId,
          areas: [
            {
              name: formData.name,
              areaType: formData.areaType,
            },
          ],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to create area');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create area');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add Area</h2>
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

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Room 101, Main Hallway, Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area Type *
              </label>
              <select
                value={formData.areaType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    areaType: e.target.value as typeof formData.areaType,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ROOM">Room</option>
                <option value="HALLWAY">Hallway</option>
                <option value="BATHROOM">Bathroom</option>
                <option value="KITCHEN">Kitchen</option>
                <option value="CLOSET">Closet</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                The following tasks will be automatically created: Cut, Roll, Trim, and
                Touch-up
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Area'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
