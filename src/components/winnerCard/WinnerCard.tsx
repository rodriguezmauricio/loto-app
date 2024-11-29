// components/simpleWinnerCard/SimpleWinnerCard.tsx

import React from "react";
import styles from "./WinnerCard.module.scss";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    username: string;
    sorteioDate: string;
    premio: number;
}

interface SimpleWinnerCardProps {
    winner: WinnerBet;
}

const SimpleWinnerCard: React.FC<SimpleWinnerCardProps> = ({ winner }) => {
    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h2>{winner.modalidade}</h2>
            </header>
            <div className={styles.content}>
                <p>
                    <strong>Usuário:</strong> {winner.username}
                </p>
                <p>
                    <strong>Data do Sorteio:</strong>{" "}
                    {new Date(winner.sorteioDate).toLocaleDateString("pt-BR")}
                </p>
                <p>
                    <strong>Hora do Sorteio:</strong>{" "}
                    {new Date(winner.sorteioDate).toLocaleTimeString("pt-BR")}
                </p>
                <p>
                    <strong>Prêmio:</strong> R$
                    {winner.premio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <div className={styles.numbers}>
                    {winner.numbers.map((num) => (
                        <span key={num} className={styles.number}>
                            {num}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleWinnerCard;
