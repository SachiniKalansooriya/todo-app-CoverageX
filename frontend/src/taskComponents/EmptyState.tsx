import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="p-16 text-center shadow-2xl glass rounded-3xl animate-fade-in">
      
      <h3 className="mb-4 text-3xl font-bold text-black">No Tasks Yet!</h3>
      <p className="max-w-md mx-auto text-lg leading-relaxed text-gray-600">
        Your task list is empty. Create your first task above to get started on your productive journey!
      </p>
      
    </div>
  );
};

export default EmptyState;