// types/ganhadores.ts
import { Bet, Result } from "./roles";
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

export interface CombinedBetResult {
    bet: Bet;
    result?: Result;
}
export type { Result, Bet };
