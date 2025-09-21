import 'dotenv/config';
import { books } from '../db/schema'
import Database from 'better-sqlite3';
import { Request, Response } from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and, like, count } from 'drizzle-orm';

// Singleton Database connection
const sqlite = new Database(process.env.DATABASE_URL!);
const db = drizzle(sqlite);

// GET /api/books
export const getBooks = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string | undefined;
        const status = req.query.status as ("planned" | "reading" | "completed") | undefined;
        const userId = req.query.userId as string | undefined;

        const whereClauses = [];

        if (search) {
            whereClauses.push(like(books.title, `%${search}%`));
        }
        if (status) {
            whereClauses.push(eq(books.status, status));
        }
        if (userId) {
            whereClauses.push(eq(books.userId, Number(userId)));
        }

        // Combine all filters with AND
        const whereCondition = whereClauses.length > 0 ? and(...whereClauses) : undefined;

        // Get total count for pagination
        const totalBooks = await db.select({ count: count() })
            .from(books)
            .where(whereCondition)
            .get();

        // Get paginated books
        const bookList = await db.select()
            .from(books)
            .where(whereCondition)
            .limit(limit)
            .offset((page - 1) * limit)
            .all();

        res.json({
            books: bookList,
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
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// POST /api/books
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, status, rating, notes, userId } = req.body;
    const result = await db.insert(books).values({
      title,
      author,
      status,
      rating,
      notes,
      userId,
    }).returning().get();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /api/books/:id
export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, author, status, rating, notes, userId } = req.body;
    const result = await db.update(books)
      .set({ title, author, status, rating, notes, userId })
      .where(eq(books.id, id))
      .returning()
      .get();
    if (!result) return res.status(404).json({ message: "Book not found" });
    res.json(result);
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