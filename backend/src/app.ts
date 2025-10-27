import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import AppDataSource from './config/data-source';

export async function createApp() {
  // ensure DB initialized before handlers that use repositories
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  return app;
}

export default createApp;
