import { Router } from 'express';

const router = Router();

// Mock tasks data
let tasks = [
  {
    id: 1,
    title: 'Sample Task 1',
    description: 'This is a sample task',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Sample Task 2',
    description: 'Another sample task',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

// Get all tasks
router.get('/', (req, res) => {
  // Return only the latest 5 tasks as per frontend logic
  const recentTasks = tasks.slice(-5);
  res.json(recentTasks);
});

// Create a new task
router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newTask = {
    id: Date.now(), // Simple ID generation
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mark task as complete
router.put('/:id/complete', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = true;
  res.json(task);
});

export default router;