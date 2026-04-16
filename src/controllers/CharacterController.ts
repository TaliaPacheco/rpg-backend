import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { checkCampaignOwnership } from '../lib/ownership';

export class CharactersController {
    async getCharactersByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const userId = req.userId;

            const check = await checkCampaignOwnership(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const characters = await prisma.character.findMany({
                where: { campaignId }
            });

            res.json(characters);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar personagens' });
        }
    }

    async createCharacter(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { name, class: characterClass, race, hp, backstory, campaignId } = req.body;

            if (!name || !characterClass || !race || !hp || !campaignId) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const check = await checkCampaignOwnership(campaignId, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const newCharacter = await prisma.character.create({
                data: {
                    name,
                    class: characterClass,
                    race,
                    hp,
                    backstory,
                    campaignId
                }
            });

            res.status(201).json(newCharacter);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar personagem' });
        }
    }

    async updateCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const { name, class: characterClass, race, hp, backstory } = req.body;

            const character = await prisma.character.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!character) {
                res.status(404).json({ message: 'Personagem não encontrado' });
                return;
            }

            if (character.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para alterar este personagem' });
                return;
            }

            const updatedCharacter = await prisma.character.update({
                where: { id },
                data: {
                    name,
                    class: characterClass,
                    race,
                    hp,
                    backstory
                }
            });

            res.json({ message: 'Personagem atualizado com sucesso', personagem: updatedCharacter });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar personagem' });
        }
    }

    async deleteCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const character = await prisma.character.findUnique({
                where: { id },
                include: { campaign: { select: { userId: true } } }
            });

            if (!character) {
                res.status(404).json({ message: 'Personagem não encontrado' });
                return;
            }

            if (character.campaign.userId !== userId) {
                res.status(403).json({ message: 'Você não tem permissão para deletar este personagem' });
                return;
            }

            const deletedCharacter = await prisma.character.delete({
                where: { id }
            });

            res.json({ message: 'Personagem deletado com sucesso', personagem: deletedCharacter });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar personagem' });
        }
    }
}
