import { z } from "zod"
import { TypeOf } from "zod/v3"

export const createUserSchema = z.object({
    name: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres'),
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres')
})

export const loginUserSchema = z.object({
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Senha invalida')
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>