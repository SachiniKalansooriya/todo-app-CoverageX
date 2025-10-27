import { useState, useEffect, useCallback } from 'react';
import TaskForm from './taskComponents/TaskForm';
import TaskCard from './taskComponents/TaskCard';
import LoadingSpinner from './taskComponents/LoadingSpinner';
import EmptyState from './taskComponents/EmptyState';
import Login from './loginComponents/Login';
import { taskService } from './services/api';
import { useAuth } from './hooks/useAuth';
import type { Task } from './types/Task';
import type { User } from './types/Auth';

function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      // Ensure we only keep the most recent 5 tasks on the client
      // (backend should already return latest 5, but this is a safety guard)
      setTasks(data.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [fetchTasks, isAuthenticated]);

  // Keep the URL in sync with auth state so navigation is structured.
  useEffect(() => {
    if (isLoading) return;

    try {
      if (!isAuthenticated) {
        // If user is not authenticated, ensure URL is root (login page)
        if (window.location.pathname !== '/') {
          window.history.replaceState({}, '', '/');
        }
      } else {
        // Authenticated users should see the dashboard at '/dashboard'
        if (window.location.pathname !== '/dashboard') {
          window.history.replaceState({}, '', '/dashboard');
        }
      }
    } catch (e) {
      console.debug('History update skipped:', e);
    }
  }, [isAuthenticated, isLoading]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateTask = async (title: string, description: string, scheduledAt?: string) => {
    try {
      setIsCreating(true);
      await taskService.createTask({ title, description, scheduledAt });
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
      // Better error output for Axios errors
      // eslint-disable-next-line no-console
      if ((err as any)?.response) {
        console.error('Error completing task:', (err as any).response.status, (err as any).response.data);
      } else {
        console.error('Error completing task:', err);
      }
    }
  };

  const handleLoginSuccess = (user: User) => {
    // The login function is called from the AuthContext
    // The token is already stored in localStorage by the Login component
    login(user, localStorage.getItem('authToken') || '');
    // Navigate to dashboard in a structured way (push state rather than full page reload)
    try {
      window.history.pushState({}, '', '/dashboard');
    } catch (e) {
      // ignore if not available
    }
    // Fetch tasks immediately after login
    void fetchTasks();
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show task page if authenticated
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundImage: 'url(/cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Logo in left corner of page */}
      <div className="absolute z-20 top-4 left-4">
        <img 
          src="/Tasks.png" 
          alt="Tasks Logo" 
          className="object-contain w-16 h-16 rounded-lg shadow-lg md:w-20 md:h-20"
        />
      </div>
      {/* Logout button fixed top-right of the page */}
      <div className="absolute z-30 top-4 right-4">
        <button
          onClick={async () => {
            const ok = window.confirm('Are you sure you want to log out?');
            if (!ok) return;
            try {
              await import('./services/api').then(m => m.authService.logout());
            } catch (e) {
              console.debug('Logout request failed:', e);
            }
            try {
              logout();
              localStorage.removeItem('authToken');
            } catch (e) {
              // ignore
            }
            try {
              window.history.replaceState({}, '', '/');
            } catch (e) {}
            window.location.reload();
          }}
          className="px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-purple-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-blue-300/30 blur-3xl animate-float" 
           style={{ animationDelay: '5s' }} />
      <div className="absolute rounded-full top-1/2 left-1/2 w-96 h-96 bg-pink-300/20 blur-3xl animate-float" 
           style={{ animationDelay: '10s' }} />

      {/* Main Content - positioned below logo */}
      <div className="container relative z-10 px-4 py-8 mx-auto mt-24 max-w-7xl">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 shadow-xl glass-strong rounded-2xl animate-slide-down">
            <div className="flex items-center justify-center gap-3 p-4 text-lg font-semibold text-black">
             
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 border shadow-xl bg-red-500/90 backdrop-blur-md border-red-300/50 rounded-2xl animate-slide-down">
            <div className="flex items-center justify-center gap-3 p-4 text-lg font-semibold text-black">
              
              {error}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Left Column - Create Task */}
          <div className="space-y-6">
            <div className="p-6 shadow-2xl glass-strong rounded-3xl animate-fade-in">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-black">
                <span className="text-3xl"></span>
                Create New Task
              </h2>
              <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
            </div>
          </div>

          {/* Right Column - Recent Tasks */}
          <div className="space-y-6">
            <div className="p-6 shadow-2xl glass-strong rounded-3xl animate-fade-in">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-black">
                <span className="text-3xl"></span>
                Recent Tasks
                <span className="text-lg font-normal text-gray-600">(Latest 5)</span>
              </h2>

              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
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
            </div>
          </div>
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