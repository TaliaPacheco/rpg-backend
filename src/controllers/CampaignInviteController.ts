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

    async joinByCode(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { code } = req.body;

            const campaign = await prisma.campaign.findUnique({ where: { inviteCode: code } });
            if (!campaign) {
                res.status(404).json({ message: 'Código de convite inválido' });
                return;
            }

            if (campaign.userId === userId) {
                res.status(400).json({ message: 'Você é o mestre desta campanha' });
                return;
            }

            const participant = await prisma.campaignParticipant.findUnique({
                where: { campaignId_userId: { campaignId: campaign.id, userId } }
            });
            if (participant) {
                res.status(409).json({ message: 'Você já participa desta campanha' });
                return;
            }

            const existing = await prisma.joinRequest.findUnique({
                where: { campaignId_userId: { campaignId: campaign.id, userId } }
            });

            if (existing) {
                if (existing.status === 'PENDENTE') {
                    res.status(409).json({ message: 'Você já tem um pedido pendente' });
                    return;
                }
                const cooldownEnd = existing.updatedAt.getTime() + JOIN_COOLDOWN_MS;
                if (Date.now() < cooldownEnd) {
                    res.status(429).json({ message: 'Aguarde antes de pedir novamente' });
                    return;
                }
                const reopened = await prisma.joinRequest.update({
                    where: { id: existing.id },
                    data: { status: 'PENDENTE' }
                });
                res.status(201).json({ message: 'Pedido enviado', joinRequest: reopened });
                return;
            }

            const joinRequest = await prisma.joinRequest.create({
                data: { campaignId: campaign.id, userId }
            });
            res.status(201).json({ message: 'Pedido enviado', joinRequest });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao pedir entrada na campanha' });
        }
    }
}
