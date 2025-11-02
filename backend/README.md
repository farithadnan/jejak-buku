# Jejak Buku Backend

This is the backend for the Jejak Buku project, using [Drizzle ORM](https://orm.drizzle.team/) and SQLite.

## Features

- SQLite database with **Drizzle ORM**
- Database schema and migrations managed with **Drizzle Kit**
- Environment variable support via `.env`
- Easily run on localhost (private) or your local network (for mobile/PWA testing)
- Docker support for containerized development

## Project Structure

```
backend/
├── drizzle/           # Database migrations (keep in git)
├── src/
│   └── db/
│   │   └── schema.ts  # Drizzle ORM schema definitions
│   └── index.ts       # (Entry point, Express server)
│   └── controllers/ # API controllers (with unit tests)
│   └── routes/ # Express routes (with unit tests)
│   └── middleware/ # Middleware (validation, etc.)
├── .env               # Environment variables (do not commit)
├── .gitignore
├── drizzle.config.ts  # Drizzle Kit config
```

## Setup

### Docker Setup (Recommended)

The easiest way to run the backend is using Docker Compose from the root directory:

```sh
cd ..
docker-compose up --build backend
```

The backend will be accessible at `http://localhost:5000`.

**Docker Configuration:**
- Base Image: `node:20-alpine`
- Working Directory: `/app`
- Exposed Port: `5000`
- Volume Mount: `./backend:/app` (for hot-reloading)
- Named Volume: `backend-node-modules` (prevents Windows/Linux binary conflicts)
- Auto-rebuild: `better-sqlite3` is automatically rebuilt for Alpine Linux on startup
- Environment: Development mode with SQLite database

### Manual Setup

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and set your variables.
   - Example:
     ```
     DB_FILE_NAME=file:jejak-buku.db
     ```

3. **Generate migrations**
   ```sh
   npm run generate:migration
   ```

4. **Apply migrations**
   ```sh
   npm run migrate
   ```

5. **Run Backend**

   - **Localhost only (private):**
     ```sh
     npm run dev:localhost
     ```
     The server will only be accessible from your PC at `http://localhost:3000`.

   - **Network (accessible from other devices on your WiFi):**
     ```sh
     npm run dev:network
     ```
     The server will be accessible from your phone or other devices at `http://<your-pc-ip>:3000`.

   - **Find your PC's IP address:**
     On Windows, run `ipconfig` and look for `IPv4 Address` (e.g., `192.168.1.10`).

6. **Run Backend Unit Tests**
```sh
npm test
```

## Docker Commands

| Command                | Description                                 |
|------------------------|---------------------------------------------|
| `docker-compose up --build backend` | Build and start backend container |
| `docker-compose down`  | Stop all containers                         |
| `docker-compose logs -f backend` | View backend logs              |
| `docker-compose exec backend sh` | Access backend container shell |
| `docker-compose restart backend` | Restart backend container      |

## Developer Notes

- **Switch between localhost and network easily** using the scripts above.
- **Keep the `drizzle/` folder in git** (do not add to `.gitignore`).
- **Do not commit your `.env` file**.
- **If you change the schema**, always generate and apply a new migration.
- **If you get migration errors** about missing columns, see the troubleshooting section below.

## Troubleshooting

- **Migration errors (e.g., missing columns):**
  - For dev, you can delete your DB and migrations, then regenerate.
  - For prod, manually add missing columns or fix the migration SQL.
- **CORS errors:**
  - Make sure your backend allows requests from your frontend's origin.

## Useful Commands

| Command                | Description                                 |
|------------------------|---------------------------------------------|
| `docker-compose up --build backend` | Run backend with Docker      |
| `npm run dev:localhost`| Run backend on localhost only               |
| `npm run dev:network`  | Run backend on all network interfaces       |
| `npm run generate:migration` | Generate migration from schema changes |
| `npm run migrate`      | Apply migrations to the database            |
| `npm test`             | Run backend unit tests                      |

---
