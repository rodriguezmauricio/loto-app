// utils/mergeBetsWithResults.ts

import { Bet, Result, CombinedBetResult } from "../../types/ganhadores";

export const mergeBetsWithResults = (bets: Bet[], results: Result[]): CombinedBetResult[] => {
    // Create a map of resultDate to Result for quick lookup
    const resultMap: { [key: string]: Result } = {};
    results.forEach((result) => {
        if (result.resultDate) {
            resultMap[result.resultDate] = result;
        }
    });

    // Merge bets with corresponding results
    const combinedData: CombinedBetResult[] = bets.map((bet) => {
        const matchedResult = resultMap[bet.resultado];
        return {
            bet,
            result: matchedResult,
        };
    });

    return combinedData;
};
