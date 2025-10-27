'use client';

import { useState } from 'react';
import { TaskList } from './TaskList';

interface AreaAccordionProps {
  area: any;
  onDelete?: (areaId: string) => void;
}

export function AreaAccordion({ area, onDelete }: AreaAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const progressColor =
    area.completionPercentage >= 75
      ? 'bg-green-500'
      : area.completionPercentage >= 50
      ? 'bg-blue-500'
      : area.completionPercentage >= 25
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${area.name}"? This will also delete all tasks in this area.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/areas/${area.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to delete area');
      }

      onDelete?.(area.id);
    } catch (err) {
      console.error('Failed to delete area:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete area');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-l-4 border-l-blue-200">
      {/* Area Header */}
      <div className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          {/* Expand Icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
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

          {/* Area Info */}
          <div className="text-left flex-1 min-w-0">
            <h5 className="text-sm font-medium text-gray-900 truncate">
              {area.name}
              {area.areaType === 'CLOSET' && (
                <span className="ml-2 text-xs text-gray-500">(Closet)</span>
              )}
            </h5>
            <p className="text-xs text-gray-500">
              {area.tasks?.length || 0} {area.tasks?.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-24">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${progressColor}`}
                  style={{ width: `${area.completionPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 w-10 text-right">
              {area.completionPercentage}%
            </span>
          </div>
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
            title="Delete area"
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

      {/* Tasks List (Expandable) */}
      {isOpen && (
        <div className="bg-gray-50 px-4 py-3">
          {area.tasks && area.tasks.length > 0 ? (
            <TaskList tasks={area.tasks} areaId={area.id} />
          ) : (
            <div className="text-center text-xs text-gray-500 py-2">
              No tasks in this area yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
