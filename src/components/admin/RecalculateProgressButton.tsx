'use client';

import { useState } from 'react';

export function RecalculateProgressButton() {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRecalculate = async () => {
    try {
      setIsRecalculating(true);
      setShowConfirm(false);

      const response = await fetch('/api/admin/recalculate-progress', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to recalculate progress');
      }

      setResult(data.data);
      alert(
        `Progress recalculated successfully!\n\nAreas: ${data.data.summary.areasRecalculated}\nFloors: ${data.data.summary.floorsRecalculated}\nSites: ${data.data.summary.sitesRecalculated}\nTime: ${data.data.summary.totalTime}`
      );
    } catch (error) {
      console.error('Failed to recalculate progress:', error);
      alert(error instanceof Error ? error.message : 'Failed to recalculate progress');
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isRecalculating}
        className="inline-flex items-center justify-center px-4 py-2 border border-orange-600 text-sm font-medium rounded-lg text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRecalculating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
            Recalculating...
          </>
        ) : (
          <>
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Recalculate All Progress
          </>
        )}
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recalculate All Progress?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This will recalculate progress values for all tasks, areas, floors, and job sites
              in the system based on current task completion data. This may take a few moments.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecalculate}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Recalculate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
