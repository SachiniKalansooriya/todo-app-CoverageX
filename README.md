# Todo App - CoverageX

## Quick Start: Build & Run with Docker

This project is a full-stack todo app (React + TypeScript frontend, Node.js + Express + TypeORM backend, PostgreSQL database) designed for easy evaluation.

**You do NOT need to create any Google Cloud Console projects or generate new credentials.**

### 1. Clone the repository
```sh
git clone https://github.com/SachiniKalansooriya/todo-app-CoverageX.git
cd todo-app-CoverageX
```

### 2. Copy the provided `.env` files
- You will receive `.env` files for both `backend` and `frontend` via email.
- Place them in the respective folders:
	- `backend/.env`
	- `frontend/.env`

### 3. Build and run the app with Docker Compose
```sh
docker-compose up -d --build
```
- This will start the database, backend, frontend, and pgAdmin (for DB inspection).
- The app will be available at: [http://localhost:5173](http://localhost:5173)

### 4. Login & Usage
- Use Google Sign-In on the login page.
- Tasks are user-specific and persisted in PostgreSQL.
- You can create, complete, and view your latest 5 tasks.
- Logout is available at the top-right corner.

### 5. Stopping the app
```sh
docker-compose down
```

---

## Troubleshooting
- If you see a blank page or errors, check your browser console for details.
- Make sure Docker Desktop is running and ports 5173 (frontend), 4000 (backend), and 5432 (db) are available.

docker-compose up -d --build
```

## For Evaluation
- No manual credential setup required. Just clone, copy `.env` files, and run with Docker.
- All code and configuration is ready for review.

---

## Project Structure
- `frontend/` - React + Vite + Tailwind UI
- `backend/` - Node.js + Express + TypeORM API
- `db/` - Postgres init scripts
- `docker-compose.yml` - Orchestrates all services

---

