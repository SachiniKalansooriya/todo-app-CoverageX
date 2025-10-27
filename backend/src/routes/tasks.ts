import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/Task';
import { User } from '../entities/User';

const router = Router();

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    // Return only the latest 5 tasks as per frontend logic
    const tasks = await taskRepository.find({
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
router.post('/', async (req, res) => {
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
router.put('/:id/complete', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const taskRepository = AppDataSource.getRepository(Task);

    const task = await taskRepository.findOne({ where: { id: taskId } });
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

export default router;