import { z } from 'zod';
import express from 'express';
import {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from '../controllers/bookController'
import { validateBody, validateParams, validateQuery } from '../middleware/zodValidate';

const router = express.Router();

// Validation
export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["planned", "reading", "completed"]).default("planned"),
  rating: z.number().int().min(0).max(5).optional(),
  notes: z.string().optional(),
  userId: z.number().int(),
});

// For :id param
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// For query params (pagination, search, filter)
export const bookQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  search: z.string().optional(),
  status: z.enum(["planned", "reading", "completed"]).optional(),
  userId: z.string().regex(/^\d+$/, "User ID must be a number").optional(),
});

// Route Handlers pointed to controller functions
router.get('/', validateQuery(bookQuerySchema), getBooks);
router.get('/:id', validateParams(idParamSchema), getBookById);
router.post('/', validateBody(bookSchema), createBook);
router.put('/:id', validateParams(idParamSchema), validateBody(bookSchema.partial()), updateBook);
router.delete('/:id', validateParams(idParamSchema), deleteBook);

export default router;