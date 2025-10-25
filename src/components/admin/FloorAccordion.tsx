'use client';

import { useState } from 'react';
import { AreaAccordion } from './AreaAccordion';
import { AddAreaModal } from './AddAreaModal';

interface FloorAccordionProps {
  floor: any;
  onRefresh: () => void;
}

export function FloorAccordion({ floor, onRefresh }: FloorAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);

  const progressColor =
    floor.completionPercentage >= 75
      ? 'bg-green-500'
      : floor.completionPercentage >= 50
      ? 'bg-blue-500'
      : floor.completionPercentage >= 25
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Floor Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
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
          </div>
        </div>
      </button>

      {/* Areas List (Expandable) */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white">
          {floor.areas && floor.areas.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {floor.areas.map((area: any) => (
                <AreaAccordion key={area.id} area={area} />
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
