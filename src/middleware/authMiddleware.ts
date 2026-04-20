import type { Request, Response, NextFunction } from '../types/express';
import { verifyToken } from '../config/authConfig';

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Token de autenticação ausente ou mal formatado' });
        }

        const token = authHeader.substring(7)

        const decoded = verifyToken(token)

        if (!decoded ){
            res.status(401).json({ message: 'Token de autenticação inválido' });
            return
        }

        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        res.status(401).json({ message: 'Erro ao validar token de autenticação' });
    }
}