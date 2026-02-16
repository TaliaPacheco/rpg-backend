import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class QuestsController {
    async getQuestsByUserId(req: Request, res: Response){
        try{
            const { id } = req.params

            if(!id || typeof id !== 'string'){
                res.status(404).json({ message: 'Usuário não encontrado'})
                return
            }

            const quests = await prisma.quest.findMany({
                where: { id },
            })

            if (quests.length === 0) {
                res.status(404).json({ message: 'Quests não encontradas' })
                return
            }

            res.json({ message: 'Quests encontradas', quests })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar quests' })
        }
    }

    async createQuest(req: Request, res: Response){
        try{
            const { title, description, status, campaignId, reward } = req.body

            if(!title || !campaignId) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' })
                return
            }

            const quest = await prisma.quest.create({
                data: {
                    title,
                    description: description || null,
                    status: status || 'pending',
                    campaignId,
                    reward: reward || null
                }
            })

            res.status(201).json({ message: 'Quest criada com sucesso', quest })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar quest' })
        }
    }

    async deleteQuest(req: Request, res: Response){
        try{
            const { id } = req.params

            if(!id || typeof id !== 'string'){
                res.status(404).json({ message: 'Quest não encontrada'})
                return
            }

            await prisma.quest.delete({
                where: { id }
            })

            res.json({ message: 'Quest deletada com sucesso' })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar quest' })
        }
    }

    async updateQuest(req: Request, res: Response){
        try{
            const { id } = req.params
            const { title, description, status, campaignId, reward } = req.body

            if(!id || typeof id !== 'string'){
                res.status(404).json({ message: 'Quest não encontrada'})
                return
            }

            const quest = await prisma.quest.update({
                where: { id },
                data: {
                    title,
                    description,
                    status,
                    campaignId,
                    reward
                }
            })

            res.json({ message: 'Quest atualizada com sucesso', quest })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar quest' })
        }
    }
}
