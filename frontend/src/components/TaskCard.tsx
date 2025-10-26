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
            <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              📌
            </span>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 break-words">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-white/80 text-base leading-relaxed break-words">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center gap-2 text-white/60 text-sm mt-4">
            <span className="text-lg">🕐</span>
            <span>{formatDate(task.created_at)}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          data-testid="done-button"
          className="flex-shrink-0 bg-gradient-to-r from-green-400 to-emerald-500 
                   hover:from-green-500 hover:to-emerald-600 text-white font-bold 
                   py-3 px-6 rounded-xl transition-all duration-300 transform 
                   hover:scale-110 active:scale-95 disabled:opacity-50 
                   disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                   flex items-center gap-2 group"
        >
          {isCompleting ? (
            <svg 
              className="animate-spin h-5 w-5" 
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
              <span className="text-xl group-hover:rotate-12 transition-transform duration-300">
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