// src/types/user.ts
import { Transaction, Wallet } from "./roles";

export interface User {
    id: string;
    username: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone: string;
    pix?: string | null;
    role: string; // e.g., 'admin', 'vendedor', 'usuario'
    valor_comissao?: number | null; // Only for vendedores
    created_on: string; // ISO date string
    updated_on: string; // ISO date string
    wallet?: Wallet | null;
}
