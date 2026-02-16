import { Response, Request } from 'express';
import { prisma } from '../../lib/prisma';

export class CampaignController {
    async getCampaignsByUserId(req: Request, res: Response){
        try{
            const { userId } = req.params

            if(!userId || typeof userId !== 'string'){
                res.status(404).json({ message: 'Usuario não encontrado'})
                return
            }

            const campaigns = await prisma.campaign.findMany({
                where: { userId },
                include: {
                    characters: true,
                    quests: true,
                    journalEntries: true
                },
            })

            if (campaigns.length === 0) {
                res.status(404).json({ message: 'Campanhas não encontradas' })
                return
            }

            res.json({ message: 'Campanhas encontradas', Campanhas: campaigns })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar campanhas' })
        }
    }

    async createCampaign(req: Request, res: Response){
        try{
            const { title, description, system, userId } = req.body

            if(!title || !description || !userId || !system){
                res.status(400).json({ message: 'Dados da campanha incompletos' })
                return
            }

            const newCampaign = await prisma.campaign.create({
                data: {
                    title,
                    description,
                    system,
                    userId
                }
            })

            res.status(201).json({ message: 'Campanha criada com sucesso', campanha: newCampaign })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar campanha' })
        }
    }

    async deleteCampaign(req: Request, res: Response){
        try{
            const { id } = req.params

            if(!id || typeof id !== 'string'){
                res.status(404).json({ message: 'Campanha não encontrada'})
                return
            }

            const deletedCampaign = await prisma.campaign.delete({
                where: { id }
            })

            res.json({ message: 'Campanha deletada com sucesso', campanha: deletedCampaign })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar campanha' })
        }
    }

}