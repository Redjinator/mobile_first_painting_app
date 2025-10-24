'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSlider } from './ProgressSlider';

interface Task {
  id: string;
  description: string;
  taskType: string;
  completionPercentage: number;
  taskOrder: number;
}

interface Area {
  id: string;
  name: string;
  areaType: string;
  completionPercentage: number;
  floor: {
    id: string;
    name: string;
    jobSite: {
      id: string;
      name: string;
    };
  };
  tasks: Task[];
}

interface TaskUpdate {
  id: string;
  percentage: number;
  notes?: string;
}

interface ProgressUpdatePageProps {
  areaId: string;
  userId: string;
}

export function ProgressUpdatePage({ areaId, userId }: ProgressUpdatePageProps) {
  const router = useRouter();
  const [area, setArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track updates for each task
  const [updates, setUpdates] = useState<Map<string, TaskUpdate>>(new Map());

  useEffect(() => {
    loadAreaData();
  }, [areaId]);

  async function loadAreaData() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/areas/${areaId}`);
      if (!response.ok) {
        throw new Error('Failed to load area');
      }
      const data = await response.json();
      if (data.success) {
        setArea(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to load area');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load area');
    } finally {
      setLoading(false);
    }
  }

  function handleProgressChange(taskId: string, percentage: number) {
    setUpdates((prev) => {
      const newUpdates = new Map(prev);
      const existing = newUpdates.get(taskId);
      newUpdates.set(taskId, {
        id: taskId,
        percentage,
        notes: existing?.notes,
      });
      return newUpdates;
    });
  }

  function handleNotesChange(taskId: string, notes: string) {
    setUpdates((prev) => {
      const newUpdates = new Map(prev);
      const existing = newUpdates.get(taskId);
      if (existing) {
        newUpdates.set(taskId, {
          ...existing,
          notes,
        });
      }
      return newUpdates;
    });
  }

  async function handleSave() {
    if (updates.size === 0) {
      router.back();
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Update each task
      const promises = Array.from(updates.values()).map(async (update) => {
        const response = await fetch(`/api/tasks/${update.id}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            percentage: update.percentage,
            notes: update.notes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error?.message || 'Failed to update task');
        }

        return response.json();
      });

      await Promise.all(promises);

      // Navigate back to dashboard on success
      router.push('/employee');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      setSaving(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  // Calculate updated area progress
  const calculateAreaProgress = () => {
    if (!area) return 0;

    let totalPercentage = 0;
    const tasks = area.tasks || [];

    tasks.forEach((task) => {
      const update = updates.get(task.id);
      totalPercentage += update ? update.percentage : task.completionPercentage;
    });

    return tasks.length > 0 ? Math.round(totalPercentage / tasks.length) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error && !area) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={handleCancel}
            className="text-sm text-red-800 underline mt-2 inline-block"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!area) {
    return null;
  }

  const areaProgress = calculateAreaProgress();
  const hasChanges = updates.size > 0;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <button
          onClick={handleCancel}
          className="text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">{area.name}</h1>
        <p className="text-sm text-gray-600">
          {area.floor.jobSite.name} - {area.floor.name}
        </p>
      </div>

      {/* Area Progress */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Area Progress</h2>
          <span className="text-lg font-bold text-blue-600">{areaProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              areaProgress >= 75
                ? 'bg-green-500'
                : areaProgress >= 50
                ? 'bg-blue-500'
                : areaProgress >= 25
                ? 'bg-yellow-500'
                : 'bg-gray-400'
            }`}
            style={{ width: `${areaProgress}%` }}
          />
        </div>
        {hasChanges && (
          <p className="text-xs text-gray-500 mt-1">
            Progress updates in real-time as you adjust sliders
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 px-2">Update Task Progress</h2>
        {area.tasks && area.tasks.length > 0 ? (
          area.tasks
            .sort((a, b) => a.taskOrder - b.taskOrder)
            .map((task) => {
              const update = updates.get(task.id);
              const currentPercentage = update ? update.percentage : task.completionPercentage;

              return (
                <div key={task.id} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">{task.description}</h3>
                    <p className="text-xs text-gray-500">{task.taskType}</p>
                  </div>

                  {/* Progress Slider */}
                  <ProgressSlider
                    value={currentPercentage}
                    onChange={(value) => handleProgressChange(task.id, value)}
                  />

                  {/* Notes (show only if this task has been updated) */}
                  {update && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={update.notes || ''}
                        onChange={(e) => handleNotesChange(task.id, e.target.value)}
                        rows={2}
                        placeholder="Add notes about this task..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-sm text-gray-500">No tasks found for this area.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : hasChanges ? `Save Progress (${updates.size} tasks)` : 'Done'}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>

      {/* Bottom spacing for fixed buttons */}
      <div className="h-32"></div>
    </div>
  );
}
