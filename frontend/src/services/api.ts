import axios from 'axios';
import type { Task, CreateTaskDto } from '../types/Task';

// Use a test-friendly lookup for environment values so Jest (which doesn't support import.meta)
// can override via (global as any).importMetaEnv in tests. Fallback to process.env then default.
const API_BASE_URL = (global as any).importMetaEnv?.VITE_API_URL || (process.env.VITE_API_URL as string) || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor: if backend returns 401, clear token and navigate to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('authToken');
        // Push to login route so the app shows the login page
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', '/login');
          // trigger a reload to ensure app state resets
          window.location.reload();
        }
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  googleSignIn: async (token: string) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/');
    return response.data;
  },

  createTask: async (task: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', task);
    return response.data;
  },

  completeTask: async (taskId: number): Promise<void> => {
    // Prefer DELETE /tasks/:id. If backend still uses the older
    // PUT /tasks/:id/complete route, fall back to that for compatibility.
    try {
      await api.delete<void>(`/tasks/${taskId}`);
    } catch (err: any) {
      // If delete isn't supported (404), try marking complete as fallback
      if (err?.response?.status === 404) {
        await api.put<void>(`/tasks/${taskId}/complete`);
      } else {
        // rethrow for caller to handle
        throw err;
      }
    }
  },
};

export default api;