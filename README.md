# Jejak Buku

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhkaGJnZjI4OTBjM3hzeHhwNW41azMzdno2Z2ltamhlbWRpZWZnbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NFA61GS9qKZ68/giphy.gif" />
</p>

Jejak Buku is a project designed to help users track, manage, and explore books.
It consists of a **TypeScript/Express/Drizzle ORM backend** and an **Angular frontend**.

---

## Features

- Book tracking and management (CRUD)
- Responsive Angular frontend (mobile & desktop)
- SQLite database with Drizzle ORM
- Database migrations with Drizzle Kit
- Environment configuration support
- Easily run on localhost or your local network (for mobile/PWA testing)
- Unit tests for both frontend and backend

---

## Project Structure

```
jejak-buku/
│
├── backend/
│   ├── .env                # Environment variables
│   ├── .env.example        # Example environment variables
│   ├── drizzle.config.ts   # Drizzle ORM configuration
│   ├── jejak-buku.db       # SQLite database file
│   ├── package.json        # Node.js dependencies and scripts
│   ├── README.md           # Backend documentation
│   ├── tsconfig.json       # TypeScript configuration
│   ├── drizzle/            # Drizzle migration files and metadata
│   └── src/
│       ├── index.ts        # Main entry point (Express server)
│       ├── db/
│       │ └── schema.ts     # Database schema definitions
│       ├── controllers/    # API controllers (with unit tests)
│       ├── routes/         # Express routes (with unit tests)
│       └── middleware/     # Middleware (validation, etc.)
│
├── frontend/
│   ├── package.json        # Angular dependencies and scripts
│   ├── README.md           # Frontend documentation
│   ├── proxy.conf.json     # Proxy for API requests during dev
│   ├── src/
│   │   ├── app/            # Angular app source code
│   │   ├── assets/
│   │   └── index.html
│   └── angular.json        # Angular CLI config
│
└── README.md               # (This file)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Docker and Docker Compose (optional, for containerized development)

---

## Docker Setup (Recommended)

The easiest way to run the project is using Docker Compose:

1. **Start the containers**
   ```sh
   docker-compose up --build

   # Start in background
   docker-compose up -d

   # View logs
   docker-compose logs -f
   ```

   **Note:** First startup will take a few minutes as dependencies are installed inside the containers.

2. **Access the application**
   - Frontend: [http://localhost:4200](http://localhost:4200)
   - Backend API: [http://localhost:5000](http://localhost:5000)

3. **Stop the containers**
   ```sh
   docker-compose down
   ```

**Docker Features:**
- 🔄 Hot-reloading enabled for both frontend and backend
- 📦 Dependencies installed inside containers (no conflicts with host OS)
- 🗄️ SQLite database with automatic better-sqlite3 rebuild for Linux
- 🌐 Network accessible from host machine

---

## Backend Setup

1. **Install dependencies**
   ```sh
   cd backend
   npm install
   # or
   yarn install
   ```

2. **Configure environment**
   ```sh
   cp .env.example .env
   # Edit .env as needed (e.g., DB_FILE_NAME=file:jejak-buku.db)
   ```

3. **Generate and apply migrations**
   ```sh
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

4. **Run Backend**

   - **Localhost only (private):**
     ```sh
     npm run dev:localhost
     ```
     Accessible only from your PC at `http://localhost:3000` (or your configured port).

   - **Network (accessible from other devices on your WiFi):**
     ```sh
     npm run dev:network
     ```
     Accessible from your phone or other devices at `http://<your-pc-ip>:3000`.

   - **Find your PC's IP address:**
     On Windows, run `ipconfig` and look for `IPv4 Address` (e.g., `192.168.1.10`).

5. **Run Backend Unit Tests**
    ```sh
      npm test
    ```

---

## Frontend Setup

1. **Install dependencies**
   ```sh
   cd frontend
   npm install
   ```

2. **Run the frontend**

   - **Localhost (private, only on your PC):**
     ```sh
     npm run start:localhost
     ```
     or
     ```sh
     ng serve --host localhost
     ```
     Open [http://localhost:4200](http://localhost:4200).

   - **Network (accessible from your phone or other devices on your WiFi):**
     ```sh
     npm run start:network
     ```
     or
     ```sh
     ng serve --host 0.0.0.0
     ```
     Open `http://<your-pc-ip>:4200` on your phone or other device.

3. **API Backend**

   - Make sure your backend is running and accessible.
   - If your backend is on a different host/port, update your API URLs in the Angular service or use environments.

4. **Run Frontend Unit Tests**
  ```sh
    ng test
  ```

---

## Building

### Docker Production Build

To build production-ready Docker images:
```sh
docker-compose build
```

### Frontend Production Build

To build the frontend for production:
```sh
cd frontend
ng build
```

To preview the production build locally:
```sh
npx serve dist/frontend --single
```

---

## Testing

- **Frontend unit tests:**
  ```sh
  cd frontend
  ng test
  ```

- **Backend unit tests**
  ```sh
  cd backend
  npm test
  ```

---

## Troubleshooting

### Docker Issues

- **"Docker is not running" error:**
  - Make sure Docker Desktop is running on your machine
  - On Windows, check that the Docker service is started

- **better-sqlite3 errors in backend:**
  - This usually happens when node_modules from Windows are mounted into Linux container
  - Solution: Rebuild the container with `docker-compose up --build`
  - The Dockerfile will automatically rebuild better-sqlite3 for Alpine Linux

- **Frontend "package.json not found" error:**
  - Ensure the WORKDIR in Dockerfile matches the volume mount path
  - Both should use `/app` as the working directory

- **Port already in use:**
  - Check if another service is using ports 5000 or 4200
  - Stop the conflicting service or change ports in docker-compose.yml

---

## Developer Notes

- **Switch between localhost and network easily** using the scripts above.
- **For PWA/offline testing:**
  Use network mode and access from your phone for a real mobile experience.
- **If you get CORS errors:**
  Make sure your backend allows requests from your frontend's origin.
- **Keep the `drizzle/` folder in git** (do not add to `.gitignore`).
- **Do not commit your `.env` file**.
- **If you change the schema**, always generate and apply a new migration.

---

## Useful Commands

| Command                        | Description                                 |
|--------------------------------|---------------------------------------------|
| `docker-compose up --build`    | Start all services with Docker              |
| `docker-compose down`          | Stop all Docker services                    |
| `docker-compose logs -f`       | View logs from all services                 |
| `npm run dev:localhost`        | Run backend on localhost only               |
| `npm run dev:network`          | Run backend on all network interfaces       |
| `npm run generate:migration`   | Generate migration from schema changes      |
| `npm run migrate`              | Apply migrations to the database            |
| `npm run start:localhost`      | Run frontend on localhost only              |
| `npm run start:network`        | Run frontend on all network interfaces      |
| `ng build`                     | Build the frontend for production           |
| `ng test`                      | Run frontend unit tests                     |
| `npm test`                     | Run backend unit tests                      |

---

## License

This project is licensed under the MIT License.
