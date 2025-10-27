-- Initialization SQL executed only when the Postgres data directory is empty (first run)
-- Create useful extensions and a dev user/schema if needed.

-- Enable uuid generation functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for cryptographic functions (optional)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Optional: create a schema for the application (TypeORM will create tables inside public by default)
-- CREATE SCHEMA IF NOT EXISTS todo;

-- No tables here because TypeORM is configured with synchronize=true and will create tables on start.
