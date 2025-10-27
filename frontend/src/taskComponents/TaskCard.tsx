import React, { useState } from 'react';
import type { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete(task.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="glass-strong rounded-2xl p-6 shadow-xl hover:shadow-2xl 
                 transition-all duration-300 hover:scale-[1.02] animate-slide-up
                 group"
      data-testid="task-card"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110">
              
            </span>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-black break-words md:text-2xl">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-base leading-relaxed break-words text-gray-600">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span className="text-lg"></span>
            <span>{formatDate(task.created_at)}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          data-testid="done-button"
          className="flex items-center flex-shrink-0 gap-2 px-6 py-3 font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl group"
        >
          {isCompleting ? (
            <svg 
              className="w-5 h-5 animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              <span className="text-xl transition-transform duration-300 group-hover:rotate-12">
                ✓
              </span>
              <span className="hidden md:inline">Done</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;