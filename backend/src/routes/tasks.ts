import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import requireAuth, { AuthRequest } from '../middleware/auth';

const router = Router();

// Protect all task routes - require a valid app JWT
router.use(requireAuth as any);

// Get all tasks for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    // Return only the latest 5 tasks as per frontend logic
    const userId = req.userId!;
    const tasks = await taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user']
    });

    res.json(tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      scheduledAt: task.scheduledAt, // Return as string to preserve exact time
      created_at: task.createdAt.toISOString(),
      updated_at: task.updatedAt.toISOString()
    })));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, scheduledAt } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskRepository = AppDataSource.getRepository(Task);

    const newTask = new Task();
    newTask.title = title;
    newTask.description = description || '';
    newTask.completed = false;

    // owner
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    newTask.userId = req.userId;

    // Parse scheduledAt if provided
    if (scheduledAt) {
      newTask.scheduledAt = scheduledAt; // Store as string to preserve exact time
    }

  const savedTask = await taskRepository.save(newTask);

    res.status(201).json({
      id: savedTask.id,
      title: savedTask.title,
      description: savedTask.description,
      completed: savedTask.completed,
      scheduledAt: savedTask.scheduledAt, 
      created_at: savedTask.createdAt.toISOString(),
      updated_at: savedTask.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Mark task as complete
router.put('/:id/complete', async (req: AuthRequest, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const taskRepository = AppDataSource.getRepository(Task);
    const userId = req.userId!;

    const task = await taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = true;
    await taskRepository.save(task);

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      scheduledAt: task.scheduledAt, 
      created_at: task.createdAt.toISOString(),
      updated_at: task.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Delete a task (used when user marks as done)
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const taskId = parseInt(req.params.id);
    console.log(`DELETE /api/tasks/${taskId} called`);
    const taskRepository = AppDataSource.getRepository(Task);
    const userId = req.userId!;

    const task = await taskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskRepository.remove(task);

    res.json({ success: true, id: taskId });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;