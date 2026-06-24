import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCampaignOwnership } from '../lib/ownership';
import { generateUniqueInviteCode } from '../lib/inviteCode';

const JOIN_COOLDOWN_MS = 60 * 60 * 1000; // 1 hora

export class CampaignInviteController {
    async getInviteCode(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const campaign = await prisma.campaign.findUnique({
                where: { id },
                select: { inviteCode: true }
            });

            let code = campaign?.inviteCode ?? null;
            if (!code) {
                code = await generateUniqueInviteCode();
                await prisma.campaign.update({ where: { id }, data: { inviteCode: code } });
            }

            res.json({ code });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao obter código de convite' });
        }
    }

    async regenerateInviteCode(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const code = await generateUniqueInviteCode();
            await prisma.campaign.update({ where: { id }, data: { inviteCode: code } });

            res.json({ code });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao regenerar código de convite' });
        }
    }
}
