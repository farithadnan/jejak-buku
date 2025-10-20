import request from 'supertest';
import express from 'express';
import bookRoutes from './bookRoutes';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { books } from '../db/schema';

const app = express();
app.use(express.json());
app.use('/api/books', bookRoutes);

beforeAll(async () => {
  // Seed the DB with one book
  const sqlite = new Database(process.env.DATABASE_URL!);
  const db = drizzle(sqlite);
  await db.insert(books).values({
    title: 'Test Book',
    author: 'Test Author',
    status: 'planned'
  }).run();
});

describe('Book Routes', () => {
  it('GET /api/books should return 200', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
  });
});