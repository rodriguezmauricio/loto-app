// types/ganhadores.ts

export interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    username: string;
    sorteioDate: string;
    premio: number;
    // Add other properties as needed
}
