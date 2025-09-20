# Jejak Buku Backend

This is the backend for the Jejak Buku project, using [Drizzle ORM](https://orm.drizzle.team/) and SQLite.

## Features

- SQLite database with **Drizzle ORM**
- Database schema and migrations managed with **Drizzle Kit**
- Environment variable support via `.env`

## Project Structure

```
backend/
├── drizzle/           # Database migrations (keep in git)
├── src/
│   └── db/
│       └── schema.ts  # Drizzle ORM schema definitions
│   └── index.ts       # (Entry point, add your server/app logic here)
├── .env               # Environment variables (do not commit)
├── .gitignore
├── drizzle.config.ts  # Drizzle Kit config
```

## Setup

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
   npx drizzle-kit generate
   ```

4. **Apply migrations**
   ```sh
   npx drizzle-kit migrate
   ```

5. **Start developing**
   - Add your backend logic in `src/index.ts`.

## Notes

- **Keep the `drizzle/` folder in git** (do not add to `.gitignore`).
- **Do not commit your `.env` file**.
