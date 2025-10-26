'use client';

import { useState } from 'react';
import { TASK_TYPES, TASK_PRESETS, type TaskPresetName } from '@/constants/task-types';

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
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set(TASK_PRESETS.MINIMAL)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTaskToggle(taskId: string) {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  }

  function handlePresetSelect(presetName: TaskPresetName) {
    setSelectedTasks(new Set(TASK_PRESETS[presetName]));
  }

  function selectAll() {
    setSelectedTasks(new Set(TASK_TYPES.map((t) => t.id)));
  }

  function deselectAll() {
    setSelectedTasks(new Set());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedTasks.size === 0) {
      setError('Please select at least one task');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert selected tasks to ordered task list
      const tasks = TASK_TYPES.filter((task) => selectedTasks.has(task.id)).map((task) => ({
        name: task.label,
        taskOrder: task.defaultOrder,
      }));

      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorId: floorId,
          areas: [
            {
              name: formData.name,
              areaType: formData.areaType,
              tasks,
            },
          ],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.error || 'Failed to create area');
      }

      onSuccess();
    } catch (err) {
      console.error('Area creation error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please check the console for details.'
      );
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Area Details */}
            <div className="space-y-4">
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
            </div>

            {/* Task Selection */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Tasks * ({selectedTasks.size} selected)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-600">Quick presets:</span>
                {Object.keys(TASK_PRESETS).map((presetName) => (
                  <button
                    key={presetName}
                    type="button"
                    onClick={() => handlePresetSelect(presetName as TaskPresetName)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    {presetName.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Task Checkboxes */}
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {TASK_TYPES.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(task.id)}
                      onChange={() => handleTaskToggle(task.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{task.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">#{task.defaultOrder}</span>
                  </label>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Tasks will be created in the order shown (indicated by #). You can reorder them
                later.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                disabled={loading || selectedTasks.size === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : `Add Area with ${selectedTasks.size} Tasks`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
