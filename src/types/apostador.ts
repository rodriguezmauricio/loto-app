// src/types/apostador.ts

export interface Apostador {
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
    walletId?: string;
    // Add other relevant fields
}
