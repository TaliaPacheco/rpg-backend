import { Response, Request } from 'express';
import { prisma } from '../../lib/prisma';
import { deleteUploadedFile, getFilenameFromPath } from '../middleware/uploadMiddleware';

export class CampaignController {
    async getCampaignsByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params

            if (!userId || typeof userId !== 'string') {
                res.status(400).json({ message: 'UserId inválido' })
                return
            }

            const campaigns = await prisma.campaign.findMany({
                where: { userId },
                include: {
                    characters: true,
                    quests: true,
                    journalEntries: true,
                    participants: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    profileImage: true
                                }
                            }
                        }
                    }
                },
            })

            res.json(campaigns.length > 0 ? campaigns[0] : null)
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar campanhas' })
        }
    }

    async createCampaign(req: Request, res: Response) {
        try {
            const { title, description, setting, userId } = req.body

            if (!title || !description || !userId) {
                res.status(400).json({ message: 'Dados da campanha incompletos' })
                return
            }

            const newCampaign = await prisma.campaign.create({
                data: {
                    title,
                    description,
                    setting,
                    userId
                }
            })

            res.status(201).json({ message: 'Campanha criada com sucesso', campanha: newCampaign })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar campanha' })
        }
    }

    async updateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { title, description, setting } = req.body

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: {
                    title,
                    description,
                    setting
                }
            })

            res.json({ message: 'Campanha atualizada com sucesso', campanha: updatedCampaign })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar campanha' })
        }
    }

    async deleteCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' })
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

    async uploadCampaignImage(req: Request, res: Response) {
        try {
            const { id } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            if (!req.file) {
                res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
                return
            }

            const campaign = await prisma.campaign.findUnique({
                where: { id },
            })

            if (!campaign) {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            if (campaign.campaignImage) {
                deleteUploadedFile(campaign.campaignImage)
            }

            const filename = getFilenameFromPath(req.file.path)

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: {
                    campaignImage: filename
                }
            })

            res.status(200).json({ 
                message: 'Imagem da campanha atualizada com sucesso', 
                campaign: updatedCampaign,
                imageUrl: `/uploads/${filename}`
            })
        } catch (error) {
            if (req.file) {
                deleteUploadedFile(getFilenameFromPath(req.file.path))
            }
            res.status(500).json({ message: 'Erro ao fazer upload da imagem' })
        }
    }

    async addParticipant(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { userId } = req.body

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            if (!userId || typeof userId !== 'string') {
                res.status(400).json({ message: 'UserId inválido' })
                return
            }

            const campaign = await prisma.campaign.findUnique({
                where: { id }
            })

            if (!campaign) {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' })
                return
            }

            const participant = await prisma.campaignParticipant.create({
                data: {
                    campaignId: id,
                    userId: userId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true
                        }
                    }
                }
            })

            res.status(201).json({ 
                message: 'Participante adicionado com sucesso', 
                participant 
            })
        } catch (error: any) {
            // Erro único constraint (usuário já é participante)
            if (error.code === 'P2002') {
                res.status(400).json({ message: 'Usuário já é participante desta campanha' })
                return
            }
            res.status(500).json({ message: 'Erro ao adicionar participante' })
        }
    }

    async removeParticipant(req: Request, res: Response) {
        try {
            const { id, userId } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Campanha não encontrada' })
                return
            }

            if (!userId || typeof userId !== 'string') {
                res.status(400).json({ message: 'UserId inválido' })
                return
            }

            const participant = await prisma.campaignParticipant.delete({
                where: {
                    campaignId_userId: {
                        campaignId: id,
                        userId: userId
                    }
                }
            })

            res.json({ 
                message: 'Participante removido com sucesso', 
                participant 
            })
        } catch (error: any) {
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Participante não encontrado' })
                return
            }
            res.status(500).json({ message: 'Erro ao remover participante' })
        }
    }

}