'use client';

interface Task {
  id: string;
  name: string;
  completionPercentage: number;
  taskOrder: number;
  notes?: string | null;
}

interface TaskListProps {
  tasks: Task[];
  areaId: string;
}

export function TaskList({ tasks, areaId }: TaskListProps) {
  // Sort tasks by taskOrder
  const sortedTasks = [...tasks].sort((a, b) => a.taskOrder - b.taskOrder);

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => {
        const progressColor =
          task.completionPercentage >= 75
            ? 'bg-green-500'
            : task.completionPercentage >= 50
            ? 'bg-blue-500'
            : task.completionPercentage >= 25
            ? 'bg-yellow-500'
            : 'bg-gray-400';

        const isComplete = task.completionPercentage === 100;

        return (
          <div
            key={task.id}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Task Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Checkmark for complete tasks */}
                {isComplete ? (
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="w-5 h-5 flex-shrink-0 border-2 border-gray-300 rounded-full" />
                )}
                <span
                  className={`text-sm font-medium truncate ${
                    isComplete ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.taskOrder}. {task.name}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${progressColor}`}
                      style={{ width: `${task.completionPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                  {task.completionPercentage}%
                </span>
              </div>
            </div>

            {/* Notes (if any) */}
            {task.notes && (
              <p className="mt-2 text-xs text-gray-500 italic pl-7">{task.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
