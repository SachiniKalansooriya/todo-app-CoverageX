import axios from 'axios';
import type { Task, CreateTaskDto } from '../types/Task';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000/api';

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
    await api.put<void>(`/tasks/${taskId}/complete`);
  },
};

export default api;