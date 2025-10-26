import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="glass rounded-3xl p-16 shadow-2xl text-center animate-fade-in">
      <div className="text-8xl mb-6 animate-bounce-slow">📭</div>
      <h3 className="text-3xl font-bold text-white mb-4">No Tasks Yet!</h3>
      <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
        Your task list is empty. Create your first task above to get started on your productive journey!
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <span className="text-4xl">✨</span>
        <span className="text-4xl">🚀</span>
        <span className="text-4xl">💪</span>
      </div>
    </div>
  );
};

export default EmptyState;