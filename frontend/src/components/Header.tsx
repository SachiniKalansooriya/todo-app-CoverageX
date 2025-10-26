import React from 'react';

interface HeaderProps {
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ taskCount }) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="glass-strong rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-6xl animate-bounce-slow">✨</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            TaskFlow
          </h1>
          <span className="text-6xl animate-bounce-slow">📝</span>
        </div>
        <p className="text-white/90 text-xl font-light">
          Organize your life, one task at a time
        </p>
        
        <div className="flex justify-center gap-6 mt-6">
          <div className="glass rounded-2xl px-6 py-3 shadow-lg">
            <div className="text-3xl font-bold text-white">{taskCount}</div>
            <div className="text-white/80 text-sm">Active Tasks</div>
          </div>
          <div className="glass rounded-2xl px-6 py-3 shadow-lg">
            <div className="text-3xl font-bold text-white">📊</div>
            <div className="text-white/80 text-sm">Productive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;