import { Router } from 'express';
import type { Request, Response } from '../types/express';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkCampaignAccess } from '../lib/ownership';
import { issueTicket, consumeTicket } from '../sse/ticketStore';
import { subscribe } from '../sse/sseHub';

const router = Router();

// Emitir ticket — protegido pelo auth Bearer normal (aplicado localmente)
router.post('/:id/events/ticket', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    const access = await checkCampaignAccess(id, userId);
    if (!access.ok) {
        res.status(access.status).json({ message: access.message });
        return;
    }

    const ticket = issueTicket(userId, id);
    res.json({ ticket });
});

// Abrir o stream SSE — autentica pelo ticket (EventSource não manda header)
router.get('/:id/events', (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = typeof req.query.ticket === 'string' ? req.query.ticket : undefined;

    if (!ticket) {
        res.status(401).json({ message: 'Ticket ausente' });
        return;
    }

    const userId = consumeTicket(ticket, id);
    if (!userId) {
        res.status(401).json({ message: 'Ticket inválido ou expirado' });
        return;
    }

    subscribe(id, res);
});

export default router;
