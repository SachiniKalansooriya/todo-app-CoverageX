import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.POSTGRES_HOST ;
const DB_PORT = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const DB_USER = process.env.POSTGRES_USER;
const DB_PASS = process.env.POSTGRES_PASSWORD;
const DB_NAME = process.env.POSTGRES_DB;

const entitiesPath = path.join(__dirname, '..', 'entities', '*.{ts,js}');
const migrationsPath = path.join(__dirname, '..', 'migrations', '*.{ts,js}');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true, 
  entities: [entitiesPath],
  migrations: [migrationsPath],
});

export default AppDataSource;
