import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateSchema(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: ZodError | any) {
            res.status(400).json({ message: 'Erro de validação', details: error.errors });
        }
    }
}