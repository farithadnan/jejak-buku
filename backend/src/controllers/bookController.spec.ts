import { getBooks } from './bookController';
import { Request, Response } from 'express';

describe('getBooks', () => {
  it('should respond with books', async () => {
    const req = { query: {} } as Request;
    const res = { json: jest.fn() } as any as Response;
    await getBooks(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});