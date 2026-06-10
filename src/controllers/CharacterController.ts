import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCampaignAccess, checkCharacterPermission } from '../lib/ownership';

export class CharactersController {
    async getCharactersByCampaignId(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const userId = req.userId;

            const access = await checkCampaignAccess(campaignId, userId);
            if (!access.ok) {
                res.status(access.status).json({ message: access.message });
                return;
            }

            const characters = await prisma.character.findMany({
                where: { campaignId },
                include: {
                    inventory: true,
                    spells: true
                }
            });

            res.json(characters);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar personagens' });
        }
    }

    async createCharacter(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const {
                name, class: characterClass, race, hpMax, hpCurrent,
                strength, dexterity, constitution, intelligence, wisdom, charisma,
                armorClass, proficiencyBonus, backstory, campaignId
            } = req.body;

            const access = await checkCampaignAccess(campaignId, userId);
            if (!access.ok) {
                res.status(access.status).json({ message: access.message });
                return;
            }

            const newCharacter = await prisma.character.create({
                data: {
                    name,
                    class: characterClass,
                    race,
                    hpMax,
                    hpCurrent: hpCurrent ?? hpMax,
                    strength,
                    dexterity,
                    constitution,
                    intelligence,
                    wisdom,
                    charisma,
                    armorClass,
                    proficiencyBonus,
                    backstory,
                    campaignId,
                    userId
                }
            });

            res.status(201).json({ message: 'Personagem criado com sucesso', personagem: newCharacter });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar personagem' });
        }
    }

    async updateCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const {
                name, class: characterClass, race, hpMax, hpCurrent,
                strength, dexterity, constitution, intelligence, wisdom, charisma,
                armorClass, proficiencyBonus, backstory
            } = req.body;

            const permission = await checkCharacterPermission(id, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const updatedCharacter = await prisma.character.update({
                where: { id },
                data: {
                    name,
                    class: characterClass,
                    race,
                    hpMax,
                    hpCurrent,
                    strength,
                    dexterity,
                    constitution,
                    intelligence,
                    wisdom,
                    charisma,
                    armorClass,
                    proficiencyBonus,
                    backstory
                }
            });

            res.json({ message: 'Personagem atualizado com sucesso', personagem: updatedCharacter });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar personagem' });
        }
    }

    async getCharacterById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(id, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const character = await prisma.character.findUnique({ where: { id } });
            res.json(character);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar personagem' });
        }
    }

    async getMyCharacters(req: Request, res: Response) {
        try {
            const userId = req.userId;

            const characters = await prisma.character.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });

            res.json(characters);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar personagens' });
        }
    }

    async deleteCharacter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(id, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
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
