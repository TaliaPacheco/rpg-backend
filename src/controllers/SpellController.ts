import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCharacterPermission } from '../lib/ownership';

export class SpellController {
    async getSpells(req: Request, res: Response) {
        try {
            const { characterId } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const spells = await prisma.characterSpell.findMany({
                where: { characterId }
            });

            res.json(spells);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar magias' });
        }
    }

    async createSpell(req: Request, res: Response) {
        try {
            const { characterId } = req.params;
            const userId = req.userId;
            const { name, level, description, prepared } = req.body;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const spell = await prisma.characterSpell.create({
                data: {
                    name,
                    level,
                    description,
                    prepared,
                    characterId
                }
            });

            res.status(201).json({ message: 'Magia adicionada com sucesso', spell });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar magia' });
        }
    }

    async updateSpell(req: Request, res: Response) {
        try {
            const { characterId, id } = req.params;
            const userId = req.userId;
            const { name, level, description, prepared } = req.body;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const spell = await prisma.characterSpell.findUnique({ where: { id } });
            if (!spell || spell.characterId !== characterId) {
                res.status(404).json({ message: 'Magia não encontrada' });
                return;
            }

            const updatedSpell = await prisma.characterSpell.update({
                where: { id },
                data: { name, level, description, prepared }
            });

            res.json({ message: 'Magia atualizada com sucesso', spell: updatedSpell });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar magia' });
        }
    }

    async deleteSpell(req: Request, res: Response) {
        try {
            const { characterId, id } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const spell = await prisma.characterSpell.findUnique({ where: { id } });
            if (!spell || spell.characterId !== characterId) {
                res.status(404).json({ message: 'Magia não encontrada' });
                return;
            }

            await prisma.characterSpell.delete({ where: { id } });

            res.json({ message: 'Magia removida com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao remover magia' });
        }
    }
}
