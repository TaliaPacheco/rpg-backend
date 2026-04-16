import { z } from 'zod';

export const createCampaignSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    setting: z.string().optional()
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
