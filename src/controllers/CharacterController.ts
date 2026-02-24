import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class CharactersController {
    async getCharactersByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;

            if (!campaignId || typeof campaignId !== 'string') {
                res.status(400).json({ error: 'Campaign ID é obrigatório' });
                return;
            }
            const characters = await prisma.character.findMany({
                where: { campaignId }
            });
            res.json(characters);
        } catch (error) {
            res.status(500).json({ error: 'Falha ao buscar personagens' });
        }
    }

    async createCharacter(req: Request, res: Response) {
        try {
            const { name, class: characterClass, race, hp, backstory, campaignId } = req.body;

            if (!name || !characterClass || !race || !hp || !campaignId) {
                res.status(400).json({ error: 'Todos os campos são obrigatórios' });
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
            res.status(500).json({ error: 'Falha ao criar personagem' });
        }
    }

    async updateCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, class: characterClass, race, hp, backstory, campaignId } = req.body;

            if (!id || typeof id !== 'string') {
                res.status(404).json({ error: 'Personagem não encontrado' });
                return;
            }

            const updatedCharacter = await prisma.character.update({
                where: { id },
                data: {
                    name,
                    class: characterClass,
                    race,
                    hp,
                    backstory,
                    campaignId
                }
            });

            res.json({ message: 'Personagem atualizado com sucesso', personagem: updatedCharacter });
        } catch (error) {
            res.status(500).json({ error: 'Falha ao atualizar personagem' });
        }
    }

    async deleteCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                res.status(400).json({ error: 'ID do personagem é obrigatório' });
                return;
            }

            const deletedCharacter = await prisma.character.delete({
                where: { id }
            });

            res.json(deletedCharacter);
        } catch (error) {
            res.status(500).json({ error: 'Falha ao deletar personagem' });
        }
    }
}
