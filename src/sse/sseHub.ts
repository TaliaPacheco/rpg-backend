import type { Response } from 'express';

const KEEPALIVE_MS = 25_000;
const connections = new Map<string, Set<Response>>();

export function subscribe(campaignId: string, res: Response): void {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    if (!connections.has(campaignId)) {
        connections.set(campaignId, new Set());
    }
    connections.get(campaignId)!.add(res);

    const keepAlive = setInterval(() => {
        res.write(': keepalive\n\n');
    }, KEEPALIVE_MS);

    res.on('close', () => {
        clearInterval(keepAlive);
        const set = connections.get(campaignId);
        if (set) {
            set.delete(res);
            if (set.size === 0) connections.delete(campaignId);
        }
    });
}

export function publish(campaignId: string, evento: { tipo: string; id: string }): void {
    const set = connections.get(campaignId);
    if (!set) return;

    const payload = `event: reveal\ndata: ${JSON.stringify(evento)}\n\n`;
    for (const res of set) {
        res.write(payload);
    }
}
