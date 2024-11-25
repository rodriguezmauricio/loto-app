// src/types/venda.ts

export interface Venda {
    id: string;
    vendedorId: string;
    product: string;
    amount: number;
    date: string; // ISO date string
    // Add other relevant fields
}
