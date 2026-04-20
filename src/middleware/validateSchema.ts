import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from '../types/express';
import { ZodSchema } from 'zod';

export function validateSchema(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ 
                    message: 'Erro de validação', 
                    errors: error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            } else {
                res.status(400).json({ message: 'Erro de validação', error });
            }
        }
    }
}