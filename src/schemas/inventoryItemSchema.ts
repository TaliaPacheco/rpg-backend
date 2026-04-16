import { z } from 'zod';

export const createInventoryItemSchema = z.object({
    name: z.string().min(1, 'Nome do item obrigatório'),
    quantity: z.number().int().min(1).optional(),
    description: z.string().optional(),
    equipped: z.boolean().optional()
});

export const updateInventoryItemSchema = z.object({
    name: z.string().min(1, 'Nome do item obrigatório').optional(),
    quantity: z.number().int().min(1).optional(),
    description: z.string().optional(),
    equipped: z.boolean().optional()
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
