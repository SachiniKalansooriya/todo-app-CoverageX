import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import { taskService } from './services/api';
import type { Task } from './types/Task';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateTask = async (title: string, description: string) => {
    try {
      setIsCreating(true);
      await taskService.createTask({ title, description });
      await fetchTasks();
      showSuccessMessage('Task created successfully!');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      await fetchTasks();
      showSuccessMessage('Task completed! Great job!');
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error('Error completing task:', err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary via-purple-500 to-secondary">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-purple-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-blue-300/30 blur-3xl animate-float" 
           style={{ animationDelay: '5s' }} />
      <div className="absolute rounded-full top-1/2 left-1/2 w-96 h-96 bg-pink-300/20 blur-3xl animate-float" 
           style={{ animationDelay: '10s' }} />

      {/* Main Content */}
      <div className="container relative z-10 max-w-5xl px-4 py-8 mx-auto">
        <Header taskCount={tasks.length} />

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 mb-6 shadow-xl glass-strong rounded-2xl animate-slide-down">
            <div className="flex items-center justify-center gap-3 text-lg font-semibold text-white">
             
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 border shadow-xl bg-red-500/90 backdrop-blur-md border-red-300/50 rounded-2xl animate-slide-down">
            <div className="flex items-center justify-center gap-3 text-lg font-semibold text-white">
              
              {error}
            </div>
          </div>
        )}

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
        </div>

        {/* Tasks Section */}
        <div className="animate-slide-up">
          <h2 className="flex items-center gap-3 mb-6 text-3xl font-bold text-white drop-shadow-lg">
           
            Recent Tasks
            <span className="text-xl font-normal text-white/80">(Latest 5)</span>
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-slide-up"
                >
                  <TaskCard task={task} onComplete={handleCompleteTask} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 shadow-xl glass rounded-2xl">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;