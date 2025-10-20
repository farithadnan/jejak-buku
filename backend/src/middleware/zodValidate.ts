import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

// Body validation
export const validateBody = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    next(err);
  }
};

// Param validation
export const validateParams = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params = schema.parse(req.params) as any;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    next(err);
  }
};

// Query validation
export const validateQuery = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.query);
    // Mutate req.query instead of reassigning
    Object.keys(req.query).forEach(key => delete (req.query as any)[key]);
    Object.assign(req.query, parsed);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    next(err);
  }
};