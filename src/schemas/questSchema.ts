import { title } from 'node:process';
import { z } from 'zod';

export const createQuestSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    reward: z.string().optional(),
    campaignId: z.string().uuid('ID da campanha inválido'),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional()
})

export type CreateQuestInput = z.infer<typeof createQuestSchema>;