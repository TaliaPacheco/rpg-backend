import crypto from 'crypto';
import { prisma } from '../../lib/prisma';

export async function generateUniqueInviteCode(): Promise<string> {
    while (true) {
        const code = crypto.randomBytes(6).toString('hex');
        const existing = await prisma.campaign.findUnique({ where: { inviteCode: code } });
        if (!existing) return code;
    }
}
