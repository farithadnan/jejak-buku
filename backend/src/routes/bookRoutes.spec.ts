import request from 'supertest';
import express from 'express';
import bookRoutes from './bookRoutes';

const app = express();
app.use(express.json());
app.use('/api/books', bookRoutes);

describe('Book Routes', () => {
  it('GET /api/books should return 200', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
  });
});