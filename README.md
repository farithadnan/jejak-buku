# Jejak Buku

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhkaGJnZjI4OTBjM3hzeHhwNW41azMzdno2Z2ltamhlbWRpZWZnbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NFA61GS9qKZ68/giphy.gif" />
</p>

Jejak Buku is a project designed to help users track, manage, and explore books. It provides a backend system for storing book data, managing migrations, and interacting with a database using modern TypeScript and Drizzle ORM tools.

> **Note:** The backend is currently under development. In the future, an Angular frontend will be added to this monorepo.

## Features
- Book tracking and management
- Database migrations with Drizzle
- TypeScript-based backend
- Environment configuration support

## Project Structure
```
backend/
  ├── .env                # Environment variables
  ├── .env.example        # Example environment variables
  ├── drizzle.config.ts   # Drizzle ORM configuration
  ├── jejak-buku.db       # SQLite database file
  ├── package.json        # Node.js dependencies and scripts
  ├── README.md           # Backend documentation
  ├── tsconfig.json       # TypeScript configuration
  ├── drizzle/            # Drizzle migration files and metadata
  │     ├── ...
  └── src/
        ├── index.ts      # Main entry point
        └── db/
              └── schema.ts  # Database schema definitions
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/farithadnan/jejak-buku.git
   cd jejak-buku/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy the example environment file and configure as needed:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```
4. Run database migrations:
   ```bash
   # Generate Migration
   npx drizzle-kit generate

   # Apply Migration
   npx drizzle-kit migrate
   ```
 5. Start the backend (development):
    ```bash
    npx ts-node src/index.ts
    ```
    > You can also use `ts-node-dev` for automatic reloads during development.

## Scripts
- `npx ts-node src/index.ts` — Start the backend server (development)
- `npm run build` — Build the TypeScript project
- `npm run migrate` — Run database migrations

> *This monorepo will include an Angular frontend in the future. Stay tuned!*

## License
This project is licensed under the MIT License.
