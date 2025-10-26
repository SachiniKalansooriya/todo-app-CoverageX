import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="glass rounded-3xl p-16 shadow-2xl text-center animate-pulse">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-white/30 rounded-full" />
          <div className="w-20 h-20 border-8 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
      </div>
      <p className="text-white text-xl font-semibold">Loading your tasks...</p>
      <p className="text-white/70 mt-2">This won't take long</p>
    </div>
  );
};

export default LoadingSpinner;