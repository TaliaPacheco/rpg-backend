import { prisma } from '../../lib/prisma';

export type OwnershipCheck =
    | { ok: true }
    | { ok: false; status: 404; message: string }
    | { ok: false; status: 403; message: string };

export type CampaignAccessCheck =
    | { ok: true; role: 'master' | 'participant' }
    | { ok: false; status: 404; message: string }
    | { ok: false; status: 403; message: string };

export async function checkCampaignOwnership(
    campaignId: string,
    userId: string
): Promise<OwnershipCheck> {
    if (!campaignId || typeof campaignId !== 'string') {
        return { ok: false, status: 404, message: 'Campanha não encontrada' };
    }

    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { userId: true }
    });

    if (!campaign) {
        return { ok: false, status: 404, message: 'Campanha não encontrada' };
    }

    if (campaign.userId !== userId) {
        return {
            ok: false,
            status: 403,
            message: 'Você não tem permissão para acessar esta campanha'
        };
    }

    return { ok: true };
}

export async function checkCampaignAccess(
    campaignId: string,
    userId: string
): Promise<CampaignAccessCheck> {
    if (!campaignId || typeof campaignId !== 'string') {
        return { ok: false, status: 404, message: 'Campanha não encontrada' };
    }

    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: {
            userId: true,
            participants: {
                where: { userId },
                select: { id: true }
            }
        }
    });

    if (!campaign) {
        return { ok: false, status: 404, message: 'Campanha não encontrada' };
    }

    const isMaster = campaign.userId === userId;
    const isParticipant = campaign.participants.length > 0;

    if (!isMaster && !isParticipant) {
        return {
            ok: false,
            status: 403,
            message: 'Você não tem acesso a esta campanha'
        };
    }

    return { ok: true, role: isMaster ? 'master' : 'participant' };
}

export type CharacterPermissionCheck =
    | { ok: true; character: { id: string; campaignId: string; userId: string } }
    | { ok: false; status: 404; message: string }
    | { ok: false; status: 403; message: string };

export async function checkCharacterPermission(
    characterId: string,
    userId: string
): Promise<CharacterPermissionCheck> {
    const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: {
            id: true,
            campaignId: true,
            userId: true,
            campaign: { select: { userId: true } }
        }
    });

    if (!character) {
        return { ok: false, status: 404, message: 'Personagem não encontrado' };
    }

    const isOwner = character.userId === userId;
    const isMaster = character.campaign.userId === userId;

    if (!isOwner && !isMaster) {
        return {
            ok: false,
            status: 403,
            message: 'Você não tem permissão para acessar este personagem'
        };
    }

    return { ok: true, character: { id: character.id, campaignId: character.campaignId, userId: character.userId } };
}
