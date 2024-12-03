// src/validation/userValidation.ts

import { z } from "zod";

export const createUserSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Nome de usuário muito curto." })
        .max(30, { message: "Nome de usuário muito longo." }),
    password: z.string().min(2, { message: "A senha deve ter pelo menos 6 caracteres." }),
    phone: z
        .string()
        .min(10, { message: "Telefone inválido." })
        .max(15, { message: "Telefone inválido." }),
    pix: z.string().optional(),
    bancaName: z.string(),
    role: z.enum(["usuario", "vendedor", "admin"]).optional().default("usuario"),
    valor_comissao: z
        .number()
        .min(0, { message: "A comissão não pode ser negativa." })
        .max(100, { message: "A comissão não pode exceder 100%." })
        .optional(), // Only required for 'vendedor'
});

export const updateUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    phone: z.string(),
    pix: z.string().optional(),
    role: z.enum(["admin", "vendedor", "usuario"]).optional(),
    valor_comissao: z.number().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().url().optional(),
});
