import { z } from "zod";

export const createCharacterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    class: z.string().min(2, 'Classe obrigatória'),
    race: z.string().min(2, 'Raça obrigatória'),
    hp: z.number().int().positive('HP deve ser um número positivo'),
    backstory: z.string().optional(),
    campaignId: z.string().uuid('ID da campanha inválido')
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;