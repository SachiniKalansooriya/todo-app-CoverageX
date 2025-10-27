import axios from 'axios';
import type { Task, CreateTaskDto } from '../types/Task';


const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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