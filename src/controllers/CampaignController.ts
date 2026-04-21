import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import { deleteUploadedFile, getFilenameFromPath } from '../middleware/uploadMiddleware';
import { checkCampaignOwnership } from '../lib/ownership';

export class CampaignController {
    async getMyCampaigns(req: Request, res: Response) {
        try {
            const userId = req.userId;

            const campaigns = await prisma.campaign.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
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
                }
            });

            res.json(campaigns);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar campanhas' });
        }
    }

    async createCampaign(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { title, description, setting } = req.body;

            const newCampaign = await prisma.campaign.create({
                data: {
                    title,
                    description,
                    setting,
                    userId
                }
            });

            res.status(201).json({ message: 'Campanha criada com sucesso', campanha: newCampaign });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar campanha' });
        }
    }

    async updateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const { title, description, setting, status } = req.body;

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: {
                    title,
                    description,
                    setting,
                    status
                }
            });

            res.json({ message: 'Campanha atualizada com sucesso', campanha: updatedCampaign });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar campanha' });
        }
    }

    async deleteCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const deletedCampaign = await prisma.campaign.delete({
                where: { id }
            });

            res.json({ message: 'Campanha deletada com sucesso', campanha: deletedCampaign });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar campanha' });
        }
    }

    async uploadCampaignImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            if (!req.file) {
                res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
                return;
            }

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                deleteUploadedFile(getFilenameFromPath(req.file.path));
                res.status(check.status).json({ message: check.message });
                return;
            }

            const campaign = await prisma.campaign.findUnique({ where: { id } });

            if (campaign?.campaignImage) {
                deleteUploadedFile(campaign.campaignImage);
            }

            const filename = getFilenameFromPath(req.file.path);

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: {
                    campaignImage: filename
                }
            });

            res.status(200).json({
                message: 'Imagem da campanha atualizada com sucesso',
                campaign: updatedCampaign,
                imageUrl: `/uploads/${filename}`
            });
        } catch (error) {
            if (req.file) {
                deleteUploadedFile(getFilenameFromPath(req.file.path));
            }
            res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
        }
    }

    async addParticipant(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const { userId: participantUserId } = req.body;

            if (!participantUserId || typeof participantUserId !== 'string') {
                res.status(400).json({ message: 'UserId do participante inválido' });
                return;
            }

            const check = await checkCampaignOwnership(id, userId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: participantUserId }
            });

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            const participant = await prisma.campaignParticipant.create({
                data: {
                    campaignId: id,
                    userId: participantUserId
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
            });

            res.status(201).json({
                message: 'Participante adicionado com sucesso',
                participant
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                res.status(400).json({ message: 'Usuário já é participante desta campanha' });
                return;
            }
            res.status(500).json({ message: 'Erro ao adicionar participante' });
        }
    }

    async removeParticipant(req: Request, res: Response) {
        try {
            const { id, userId: participantUserId } = req.params;
            const requesterId = req.userId;

            const check = await checkCampaignOwnership(id, requesterId);
            if (!check.ok) {
                res.status(check.status).json({ message: check.message });
                return;
            }

            const participant = await prisma.campaignParticipant.delete({
                where: {
                    campaignId_userId: {
                        campaignId: id,
                        userId: participantUserId
                    }
                }
            });

            res.json({
                message: 'Participante removido com sucesso',
                participant
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Participante não encontrado' });
                return;
            }
            res.status(500).json({ message: 'Erro ao remover participante' });
        }
    }
}
