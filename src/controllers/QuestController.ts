import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCampaignAccess, checkCampaignOwnership } from '../lib/ownership';

export class QuestsController {
    async getQuestsByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const userId = req.userId;

            const check = await checkCampaignAccess(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const quests = await prisma.quest.findMany({
                where: { campaignId },
                orderBy: { createdAt: 'desc' }
            });

            res.json(quests);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar quests' });
        }
    }

    async createQuest(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { title, description, status, campaignId, reward } = req.body;

            if (!title || !campaignId) {
                res.status(400).json({ message: 'Título e campaignId são obrigatórios' });
                return;
            }

            const check = await checkCampaignOwnership(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const quest = await prisma.quest.create({
                data: {
                    title,
                    description: description || null,
                    status: status || 'PENDENTE',
                    campaignId,
                    reward: reward || null
                }
            });

            res.status(201).json({ message: 'Quest criada com sucesso', quest });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar quest' });
        }
    }

    async updateQuest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const { title, description, status, reward } = req.body;

            const quest = await prisma.quest.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!quest) {
                res.status(404).json({ message: 'Quest não encontrada' });
                return;
            }

            if (quest.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para alterar esta quest' });
                return;
            }

            const updatedQuest = await prisma.quest.update({
                where: { id },
                data: {
                    title,
                    description,
                    status,
                    reward
                }
            });

            res.json({ message: 'Quest atualizada com sucesso', quest: updatedQuest });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar quest' });
        }
    }

    async deleteQuest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const quest = await prisma.quest.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!quest) {
                res.status(404).json({ message: 'Quest não encontrada' });
                return;
            }

            if (quest.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para deletar esta quest' });
                return;
            }

            await prisma.quest.delete({ where: { id } });

            res.json({ message: 'Quest deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar quest' });
        }
    }
}
