import React, { useState } from 'react';

interface TaskFormProps {
  // onSubmit receives title, description and optional scheduled ISO datetime string
  onSubmit: (title: string, description: string, scheduledAt?: string) => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [date, setDate] = useState(() => {
    // default to today 
    const now = new Date();
    const min = new Date('2025-01-01');
    const chosen = now < min ? min : now;
    return chosen.toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // build scheduled ISO string in local time
      let scheduledAt: string | undefined = undefined;
      if (date) {
        // create a Date object from selected date + time
        const [y, m, d] = date.split('-').map((s) => parseInt(s, 10));
        const hh = parseInt(hour, 10);
        const mm = parseInt(minute, 10);
        // Use local timezone and produce ISO string
        const dt = new Date(y, m - 1, d, hh % 24, mm % 60, 0, 0);
        scheduledAt = dt.toISOString();
      }

      onSubmit(title.trim(), description.trim(), scheduledAt);
      setTitle('');
      setDescription('');
      // reset date/time to defaults
      const now = new Date();
      const min = new Date('2025-01-01');
      const chosen = now < min ? min : now;
      setDate(chosen.toISOString().slice(0, 10));
      setHour('12');
      setMinute('00');
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
        <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-white">
          <span className="text-3xl"></span>
          Create New Task
        </h2>

        <div className="space-y-5">
          {/* Title Input */}
          <div className="relative">
            <label 
              htmlFor="title" 
              className="block mb-2 text-sm font-semibold tracking-wide uppercase text-white/90"
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
              className="w-full px-5 py-4 text-lg text-white transition-all duration-300 border-2 shadow-lg bg-white/20 border-white/30 rounded-2xl placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/25 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            />
          </div>

          {/* Date & Time selectors */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-semibold tracking-wide uppercase text-white/90">Date</label>
              <input
                type="date"
                value={date}
                min="2025-01-01"
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 text-white border rounded-lg bg-white/20 border-white/30"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold tracking-wide uppercase text-white/90">Hour</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                size={4}
                className="w-full px-4 py-3 overflow-y-auto text-white border rounded-lg bg-white/20 border-white/30"
                disabled={isLoading}
              >
                {Array.from({ length: 24 }).map((_, i) => {
                  const v = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold tracking-wide uppercase text-white/90">Minutes</label>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                size={4}
                className="w-full px-4 py-3 overflow-y-auto text-white border rounded-lg bg-white/20 border-white/30"
                disabled={isLoading}
              >
                {Array.from({ length: 60 }).map((_, i) => {
                  const v = i.toString().padStart(2, '0');
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Description Input */}
          <div className="relative">
            <label 
              htmlFor="description" 
              className="block mb-2 text-sm font-semibold tracking-wide uppercase text-white/90"
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
              className="w-full px-5 py-4 text-lg text-white transition-all duration-300 border-2 shadow-lg resize-none bg-white/20 border-white/30 rounded-2xl placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/25 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                  className="w-6 h-6 animate-spin" 
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
                <span className="text-2xl"></span>
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