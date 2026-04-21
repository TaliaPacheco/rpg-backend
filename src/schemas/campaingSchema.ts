import { z } from 'zod';

export const createCampaignSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    setting: z.string().optional()
});

export const updateCampaignSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').optional(),
    description: z.string().optional(),
    setting: z.string().optional(),
    status: z.enum(['ATIVA', 'FINALIZADA']).optional()
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
