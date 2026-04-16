import { z } from 'zod';

export const createSpellSchema = z.object({
    name: z.string().min(1, 'Nome da magia obrigatório'),
    level: z.number().int().min(0).max(9).optional(),
    description: z.string().optional(),
    prepared: z.boolean().optional()
});

export const updateSpellSchema = z.object({
    name: z.string().min(1, 'Nome da magia obrigatório').optional(),
    level: z.number().int().min(0).max(9).optional(),
    description: z.string().optional(),
    prepared: z.boolean().optional()
});

export type CreateSpellInput = z.infer<typeof createSpellSchema>;
export type UpdateSpellInput = z.infer<typeof updateSpellSchema>;
