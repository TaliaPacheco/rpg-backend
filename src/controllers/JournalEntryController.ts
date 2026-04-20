import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCampaignOwnership } from '../lib/ownership';

export class journalEntriesController {
    async getJournalEntriesByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const userId = req.userId;

            const check = await checkCampaignOwnership(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const journalEntries = await prisma.journalEntry.findMany({
                where: { campaignId },
                orderBy: { eventDate: 'desc' }
            });

            res.json(journalEntries);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar entradas de diário' });
        }
    }

    async createJournalEntry(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { content, campaignId } = req.body;

            if (!content || !campaignId) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const check = await checkCampaignOwnership(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const journalEntry = await prisma.journalEntry.create({
                data: {
                    eventDate: new Date(),
                    content,
                    campaignId
                }
            });

            res.status(201).json({ message: 'Entrada de diário criada com sucesso', journalEntry });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar entrada de diário' });
        }
    }

    async updateJournalEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const { content } = req.body;

            if (!content) {
                res.status(400).json({ message: 'O campo content é obrigatório' });
                return;
            }

            const journalEntry = await prisma.journalEntry.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!journalEntry) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            if (journalEntry.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para alterar esta entrada' });
                return;
            }

            const updatedJournalEntry = await prisma.journalEntry.update({
                where: { id },
                data: { content }
            });

            res.json({ message: 'Entrada de diário atualizada com sucesso', journalEntry: updatedJournalEntry });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar entrada de diário' });
        }
    }

    async deleteJournalEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const journalEntry = await prisma.journalEntry.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!journalEntry) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            if (journalEntry.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para deletar esta entrada' });
                return;
            }

            await prisma.journalEntry.delete({ where: { id } });

            res.json({ message: 'Entrada de diário deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar entrada de diário' });
        }
    }
}
