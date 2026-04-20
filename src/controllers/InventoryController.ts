import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { checkCharacterPermission } from '../lib/ownership';

export class InventoryController {
    async getItems(req: Request, res: Response) {
        try {
            const { characterId } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const items = await prisma.inventoryItem.findMany({
                where: { characterId }
            });

            res.json(items);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar itens' });
        }
    }

    async createItem(req: Request, res: Response) {
        try {
            const { characterId } = req.params;
            const userId = req.userId;
            const { name, quantity, description, equipped } = req.body;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const item = await prisma.inventoryItem.create({
                data: {
                    name,
                    quantity,
                    description,
                    equipped,
                    characterId
                }
            });

            res.status(201).json({ message: 'Item adicionado com sucesso', item });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar item' });
        }
    }

    async updateItem(req: Request, res: Response) {
        try {
            const { characterId, id } = req.params;
            const userId = req.userId;
            const { name, quantity, description, equipped } = req.body;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const item = await prisma.inventoryItem.findUnique({ where: { id } });
            if (!item || item.characterId !== characterId) {
                res.status(404).json({ message: 'Item não encontrado' });
                return;
            }

            const updatedItem = await prisma.inventoryItem.update({
                where: { id },
                data: { name, quantity, description, equipped }
            });

            res.json({ message: 'Item atualizado com sucesso', item: updatedItem });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar item' });
        }
    }

    async deleteItem(req: Request, res: Response) {
        try {
            const { characterId, id } = req.params;
            const userId = req.userId;

            const permission = await checkCharacterPermission(characterId, userId);
            if (!permission.ok) {
                res.status(permission.status).json({ message: permission.message });
                return;
            }

            const item = await prisma.inventoryItem.findUnique({ where: { id } });
            if (!item || item.characterId !== characterId) {
                res.status(404).json({ message: 'Item não encontrado' });
                return;
            }

            await prisma.inventoryItem.delete({ where: { id } });

            res.json({ message: 'Item removido com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao remover item' });
        }
    }
}
