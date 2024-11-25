// src/types/aposta.ts

export interface Aposta {
    id: string;
    apostadorId: string;
    numbers: number[];
    date: string; // ISO date string
    // Add other relevant fields
}
