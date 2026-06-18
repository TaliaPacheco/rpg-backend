import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCampaignAccess, checkCampaignOwnership } from '../lib/ownership';
import { publish } from '../sse/sseHub';

export class journalEntriesController {
    async getJournalEntriesByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const userId = req.userId;

            const check = await checkCampaignAccess(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const journalEntries = await prisma.journalEntry.findMany({
                where: {
                    campaignId,
                    ...(check.role === 'participant' ? { visibleToPlayers: true } : {})
                },
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
            const { content, campaignId, visibleToPlayers } = req.body;

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
                    campaignId,
                    visibleToPlayers: visibleToPlayers ?? false
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
            const { content, visibleToPlayers } = req.body;

            const journalEntry = await prisma.journalEntry.findUnique({
                where: { id },
                select: { campaignId: true, visibleToPlayers: true }
            });

            if (!journalEntry) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            const check = await checkCampaignOwnership(journalEntry.campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const updatedJournalEntry = await prisma.journalEntry.update({
                where: { id },
                data: { content, visibleToPlayers }
            });

            if (journalEntry.visibleToPlayers === false && updatedJournalEntry.visibleToPlayers === true) {
                publish(journalEntry.campaignId, { tipo: 'journal', id });
            }

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
                select: { campaignId: true }
            });

            if (!journalEntry) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            const check = await checkCampaignOwnership(journalEntry.campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            await prisma.journalEntry.delete({ where: { id } });

            res.json({ message: 'Entrada de diário deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar entrada de diário' });
        }
    }

    async getJournalEntryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const journalEntry = await prisma.journalEntry.findUnique({ where: { id } });
            if (!journalEntry) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            const check = await checkCampaignAccess(journalEntry.campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            if (check.role === 'participant' && !journalEntry.visibleToPlayers) {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            res.json(journalEntry);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar entrada de diário' });
        }
    }
}
