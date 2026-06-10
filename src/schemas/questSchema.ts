import { z } from 'zod';

export const createQuestSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    reward: z.string().optional(),
    campaignId: z.string().uuid('ID da campanha inválido'),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
    visibleToPlayers: z.boolean().optional()
});

export const updateQuestSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').optional(),
    description: z.string().optional(),
    reward: z.string().optional(),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
    visibleToPlayers: z.boolean().optional()
});

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
