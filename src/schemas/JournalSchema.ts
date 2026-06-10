import { z } from 'zod';

export const createJournalSchema = z.object({
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
    campaignId: z.string().uuid('ID da campanha inválido'),
    visibleToPlayers: z.boolean().optional()
});

export const updateJournalSchema = z.object({
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres').optional(),
    visibleToPlayers: z.boolean().optional()
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
