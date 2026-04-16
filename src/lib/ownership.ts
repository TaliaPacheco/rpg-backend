import { prisma } from '../../lib/prisma';

export type OwnershipCheck =
    | { ok: true }
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
