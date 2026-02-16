import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class journalEntriesController {
    async getJournalEntriesByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;

            if (!campaignId || typeof campaignId !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' });
                return;
            }

            const journalEntries = await prisma.journalEntry.findMany({
                where: { campaignId },
            });

            if (journalEntries.length === 0) {
                res.status(404).json({ message: 'Entradas de diário não encontradas' });
                return;
            }

            res.json({ message: 'Entradas de diário encontradas', journalEntries });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar entradas de diário' });
        }
    }

    async createJournalEntry(req: Request, res: Response) {
        try {
            const { content, campaignId } = req.body;

            if ( !content || !campaignId) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
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

    async deleteJournalEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            await prisma.journalEntry.delete({
                where: { id },
            });

            res.json({ message: 'Entrada de diário deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar entrada de diário' });
        }
    }

    async updateJournalEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Entrada de diário não encontrada' });
                return;
            }

            if (!content) {
                res.status(400).json({ message: 'O campo content é obrigatório' });
                return;
            }

            const updatedJournalEntry = await prisma.journalEntry.update({
                where: { id },
                data: { content },
            });

            res.json({ message: 'Entrada de diário atualizada com sucesso', updatedJournalEntry });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar entrada de diário' });
        }
    }
}