import { z } from 'zod';

export const joinCampaignSchema = z.object({
    code: z.string().min(1, 'Código é obrigatório')
});

export type JoinCampaignInput = z.infer<typeof joinCampaignSchema>;
