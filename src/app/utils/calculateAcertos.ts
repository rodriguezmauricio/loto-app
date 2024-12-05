// src/utils/calculateAcertos.ts

export const calculateAcertos = (userNumbers: number[], winningNumbers: number[]): number => {
    const userSet = new Set(userNumbers);
    let hits = 0;

    winningNumbers.forEach((num) => {
        if (userSet.has(num)) hits += 1;
    });

    return hits;
};
