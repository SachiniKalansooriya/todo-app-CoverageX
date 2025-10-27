import React from 'react';

interface HeaderProps {
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ taskCount }) => {
  return (
    <div className="mb-8 text-center animate-fade-in">
      <div className="p-8 shadow-2xl glass-strong rounded-3xl">
        <div className="flex items-center justify-center gap-4 mb-3">
        
          <h1 className="text-5xl font-bold text-white md:text-6xl drop-shadow-lg">
            TaskFlow
          </h1>
          <span className="text-6xl animate-bounce-slow"></span>
        </div>
        <p className="text-xl font-light text-white/90">
          Organize your life, one task at a time
        </p>
        
        <div className="flex justify-center gap-6 mt-6">
          <div className="px-6 py-3 shadow-lg glass rounded-2xl">
            <div className="text-3xl font-bold text-white">{taskCount}</div>
            <div className="text-sm text-white/80">Active Tasks</div>
          </div>
          <div className="px-6 py-3 shadow-lg glass rounded-2xl">
            <div className="text-3xl font-bold text-white"></div>
            <div className="text-sm text-white/80">Productive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;