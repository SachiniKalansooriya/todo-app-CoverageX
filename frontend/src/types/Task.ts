export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  scheduledAt: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  // Optional scheduled ISO datetime string, e.g. '2025-01-02T14:30:00Z' or local ISO
  scheduledAt?: string;
}