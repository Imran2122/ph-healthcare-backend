import { NextFunction, Request, Response } from "express";
import z from "zod";

// middleware
export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    // sanitize
    req.body = parsedResult.data;

    // move to next fn
    next();
  };
};
