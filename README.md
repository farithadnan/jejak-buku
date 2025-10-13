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
│       └── db/
│           └── schema.ts   # Database schema definitions
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

---

## Building

To build the frontend for production:
```sh
cd frontend
ng build
```

---

## Testing

- **Frontend unit tests:**
  ```sh
  cd frontend
  ng test
  ```

- **Frontend end-to-end tests:**
  ```sh
  cd frontend
  ng e2e
  ```

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
| `npm run dev:localhost`        | Run backend on localhost only               |
| `npm run dev:network`          | Run backend on all network interfaces       |
| `npm run generate:migration`   | Generate migration from schema changes      |
| `npm run migrate`              | Apply migrations to the database            |
| `npm run start:localhost`      | Run frontend on localhost only              |
| `npm run start:network`        | Run frontend on all network interfaces      |
| `ng build`                     | Build the frontend for production           |
| `ng test`                      | Run frontend unit tests                     |

---

## License

This project is licensed under the MIT License.
