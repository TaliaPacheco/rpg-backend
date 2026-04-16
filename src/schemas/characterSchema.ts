import { z } from 'zod';

const attributeField = z.number().int().min(1).max(30).optional();

export const createCharacterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    class: z.string().min(2, 'Classe obrigatória'),
    race: z.string().min(2, 'Raça obrigatória'),
    hpMax: z.number().int().positive('HP máximo deve ser positivo'),
    hpCurrent: z.number().int().min(0, 'HP atual não pode ser negativo').optional(),
    strength: attributeField,
    dexterity: attributeField,
    constitution: attributeField,
    intelligence: attributeField,
    wisdom: attributeField,
    charisma: attributeField,
    armorClass: z.number().int().min(0).optional(),
    proficiencyBonus: z.number().int().min(1).optional(),
    backstory: z.string().optional(),
    campaignId: z.string().uuid('ID da campanha inválido')
});

export const updateCharacterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
    class: z.string().min(2, 'Classe obrigatória').optional(),
    race: z.string().min(2, 'Raça obrigatória').optional(),
    hpMax: z.number().int().positive('HP máximo deve ser positivo').optional(),
    hpCurrent: z.number().int().min(0, 'HP atual não pode ser negativo').optional(),
    strength: attributeField,
    dexterity: attributeField,
    constitution: attributeField,
    intelligence: attributeField,
    wisdom: attributeField,
    charisma: attributeField,
    armorClass: z.number().int().min(0).optional(),
    proficiencyBonus: z.number().int().min(1).optional(),
    backstory: z.string().optional()
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
