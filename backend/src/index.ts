import 'dotenv/config';
import express from 'express';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { books } from './db/schema';

const app = express();
app.use(express.json());

// DB connection
const sqlite = new Database(process.env.DB_FILE_NAME!);
const db = drizzle(sqlite);

// test endpoint
app.get("/", (req, res) => {
  res.send("Jejak Buku Backend is running!");
});

// List books
app.get("/books", (req, res) => {
  const allBooks = db.select().from(books).all();
  res.json(allBooks);
});

// Add book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  db.insert(books).values({ title, author }).run();
  res.json({ message: "Book added" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

