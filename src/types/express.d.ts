import type { Request as ExpressRequest, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export type Request = ExpressRequest<Record<string, string>>;
export type { Response, NextFunction };
