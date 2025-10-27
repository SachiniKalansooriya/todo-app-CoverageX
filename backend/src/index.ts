import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import AppDataSource from './config/data-source';

async function start() {
  try {
    console.log('Initializing database...');
    await AppDataSource.initialize();
    console.log('Data source initialized');
  } catch (err) {
    console.error('Failed to initialize data source:', err);
  }

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();