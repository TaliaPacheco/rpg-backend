import crypto from 'crypto';

type TicketData = {
    userId: string;
    campaignId: string;
    expiresAt: number;
};

const TICKET_TTL_MS = 30_000;
const tickets = new Map<string, TicketData>();

export function issueTicket(userId: string, campaignId: string): string {
    const ticket = crypto.randomBytes(32).toString('hex');
    tickets.set(ticket, { userId, campaignId, expiresAt: Date.now() + TICKET_TTL_MS });
    return ticket;
}

export function consumeTicket(ticket: string, campaignId: string): string | null {
    const data = tickets.get(ticket);
    if (!data) return null;

    tickets.delete(ticket);

    if (data.expiresAt < Date.now()) return null;
    if (data.campaignId !== campaignId) return null;

    return data.userId;
}
