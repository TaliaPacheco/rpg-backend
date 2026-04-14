import { z } from 'zod';

export const createCampaignSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    setting: z.string().optional(),
    userId: z.string().uuid('ID do usuário inválido')
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
