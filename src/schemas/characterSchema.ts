import { z } from "zod";

export const createCharacterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    class: z.string().min(2, 'Classe obrigatória'),
    race: z.string().min(2, 'Raça obrigatória'),
    hpMax: z.number().int().positive('HP máximo deve ser um número positivo'),
    hpCurrent: z.number().int().min(0, 'HP atual não pode ser negativo'),
    strength: z.number().int().min(1).max(30).optional(),
    dexterity: z.number().int().min(1).max(30).optional(),
    constitution: z.number().int().min(1).max(30).optional(),
    intelligence: z.number().int().min(1).max(30).optional(),
    wisdom: z.number().int().min(1).max(30).optional(),
    charisma: z.number().int().min(1).max(30).optional(),
    armorClass: z.number().int().min(0).optional(),
    proficiencyBonus: z.number().int().min(0).optional(),
    backstory: z.string().optional(),
    campaignId: z.string().uuid('ID da campanha inválido')
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
