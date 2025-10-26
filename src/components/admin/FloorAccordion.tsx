'use client';

import { useState } from 'react';
import { AreaAccordion } from './AreaAccordion';
import { AddAreaModal } from './AddAreaModal';

interface FloorAccordionProps {
  floor: any;
  onRefresh: () => void;
  onDelete?: (floorId: string) => void;
}

export function FloorAccordion({ floor, onRefresh, onDelete }: FloorAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const progressColor =
    floor.completionPercentage >= 75
      ? 'bg-green-500'
      : floor.completionPercentage >= 50
      ? 'bg-blue-500'
      : floor.completionPercentage >= 25
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  const handleDeleteFloor = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${floor.name}"? This will also delete all areas and tasks in this floor.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/floors/${floor.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to delete floor');
      }

      onDelete?.(floor.id);
    } catch (err) {
      console.error('Failed to delete floor:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete floor');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteArea = () => {
    onRefresh();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Floor Header */}
      <div className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          {/* Expand Icon */}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Floor Info */}
          <div className="text-left flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{floor.name}</h4>
            <p className="text-xs text-gray-500">
              {floor.areas?.length || 0} {floor.areas?.length === 1 ? 'area' : 'areas'}
            </p>
          </div>
        </button>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-32">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${progressColor}`}
                style={{ width: `${floor.completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 w-12 text-right">
            {floor.completionPercentage}%
          </span>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDeleteFloor}
              disabled={isDeleting}
              className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
              title="Delete floor"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Areas List (Expandable) */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white">
          {floor.areas && floor.areas.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {floor.areas.map((area: any) => (
                <AreaAccordion key={area.id} area={area} onDelete={handleDeleteArea} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No areas in this floor yet.
            </div>
          )}

          {/* Add Area Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setShowAddArea(true)}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              + Add Area
            </button>
          </div>
        </div>
      )}

      {/* Add Area Modal */}
      {showAddArea && (
        <AddAreaModal
          floorId={floor.id}
          onClose={() => setShowAddArea(false)}
          onSuccess={() => {
            setShowAddArea(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
