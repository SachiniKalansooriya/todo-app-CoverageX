import React, { useState } from 'react';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="animate-scale-in">
      <form 
        onSubmit={handleSubmit} 
        className={`glass-strong rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 ${
          isFocused ? 'ring-2 ring-white/50 scale-[1.02]' : ''
        }`}
        data-testid="task-form"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">➕</span>
          Create New Task
        </h2>

        <div className="space-y-5">
          {/* Title Input */}
          <div className="relative">
            <label 
              htmlFor="title" 
              className="block text-white/90 font-semibold mb-2 text-sm uppercase tracking-wide"
            >
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What needs to be done?"
              required
              disabled={isLoading}
              data-testid="title-input"
              className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-2xl 
                       text-white placeholder-white/50 focus:outline-none focus:border-white/60 
                       focus:bg-white/25 transition-all duration-300 text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       backdrop-blur-sm shadow-lg"
            />
          </div>

          {/* Description Input */}
          <div className="relative">
            <label 
              htmlFor="description" 
              className="block text-white/90 font-semibold mb-2 text-sm uppercase tracking-wide"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Add some details..."
              rows={4}
              disabled={isLoading}
              data-testid="description-input"
              className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-2xl 
                       text-white placeholder-white/50 focus:outline-none focus:border-white/60 
                       focus:bg-white/25 transition-all duration-300 resize-none text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       backdrop-blur-sm shadow-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            data-testid="submit-button"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 
                     hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl 
                     transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     active:scale-95 flex items-center justify-center gap-3 text-lg
                     shadow-xl"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin h-6 w-6" 
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
                Creating...
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span>
                Add Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;