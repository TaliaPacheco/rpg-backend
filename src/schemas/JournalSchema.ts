import { z } from 'zod';

export const createJournalSchema = z.object({
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
    campaignId: z.string().uuid('ID da campanha inválido')
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
