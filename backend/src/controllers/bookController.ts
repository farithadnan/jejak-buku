import 'dotenv/config';
import { books } from '../db/schema'
import Database from 'better-sqlite3';
import { Request, Response } from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and, like, count } from 'drizzle-orm';

const sqlite = new Database(process.env.DATABASE_URL!);
const db = drizzle(sqlite);

// Helper to parse genres
function parseGenres(genres: any): string {
  if (Array.isArray(genres)) return JSON.stringify(genres);
  if (typeof genres === 'string') return genres;
  return '[]';
}
function parseGenresOut(genres: any): string[] {
  try { return genres ? JSON.parse(genres) : []; } catch { return []; }
}

// GET /api/books
export const getBooks = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string | undefined;
        const status = req.query.status as ("planned" | "reading" | "completed") | undefined;
        const genre = req.query.genre as string | undefined; // Add this line

        const whereClauses = [];
        if (search) whereClauses.push(like(books.title, `%${search}%`));
        if (status) whereClauses.push(eq(books.status, status));
        // Add genre filtering
        if (genre) whereClauses.push(like(books.genres, `%"${genre}"%`));

        const whereCondition = whereClauses.length > 0 ? and(...whereClauses) : undefined;

        const totalBooks = await db.select({ count: count() })
            .from(books)
            .where(whereCondition)
            .get();

        const bookList = await db.select()
            .from(books)
            .where(whereCondition)
            .limit(limit)
            .offset((page - 1) * limit)
            .all();

        // Parse genres for each book
        const booksOut = bookList.map(b => ({ ...b, genres: parseGenresOut(b.genres) }));

        res.json({
            books: booksOut,
            totalBooks: totalBooks?.count ?? 0,
            totalPages: Math.ceil((totalBooks?.count ?? 0) / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET /api/books/:id
export const getBookById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const book = await db.select().from(books).where(eq(books.id, id)).get();
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json({ ...book, genres: parseGenresOut(book.genres) });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// POST /api/books
export const createBook = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    // Example mapping before insert
    const bookData = {
      ...req.body,
      image_url: req.body.imageUrl, // map camelCase to snake_case
      genres: parseGenres(req.body.genres),
      createdAt: now,
      updatedAt: now,
    };
    delete bookData.imageUrl; // remove camelCase to avoid duplicate
    const result = await db.insert(books).values(bookData).returning().get();
    res.status(201).json({ ...result, genres: parseGenresOut(result.genres) });
  } catch (error) {
    console.error('Create Book Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /api/books/:id
export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const now = new Date().toISOString();

    // Fetch existing book first
    const existingBook = await db.select().from(books).where(eq(books.id, id)).get();
    if (!existingBook) return res.status(404).json({ message: "Book not found" });

    // Only update genres if present in payload, otherwise keep existing
    let updateData: any = { ...req.body, updatedAt: now };
    if ('genres' in req.body) {
      updateData.genres = parseGenres(req.body.genres);
    } else {
      updateData.genres = existingBook.genres;
    }

    const result = await db.update(books)
      .set(updateData)
      .where(eq(books.id, id))
      .returning()
      .get();

    res.json({ ...result, genres: parseGenresOut(result.genres) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /api/books/:id
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await db.delete(books).where(eq(books.id, id)).returning().get();
    if (!result) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};