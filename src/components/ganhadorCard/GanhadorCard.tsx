// ganhadorCard/GanhadorCard.tsx

import React from "react";
import styles from "./GanhadorCard.module.scss";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string; // ISO string
    premio: number;
    betPlacedDate: string; // ISO string
}

interface GanhadorCardProps {
    winner: WinnerBet;
}

const GanhadorCard: React.FC<GanhadorCardProps> = ({ winner }) => {
    // Parse the ISO strings into real Dates for display
    const dateSorteio = new Date(winner.sorteioDate);
    const dateAposta = new Date(winner.betPlacedDate);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h4 className={styles.userName}>{winner.userName}</h4>
                <span className={styles.premio}>Prêmio: R$ {winner.premio.toFixed(2)}</span>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.detail}>
                    <span className={styles.label}>Modalidade:</span>
                    <span className={styles.value}>{winner.modalidade}</span>
                </div>
                <div className={styles.detail}>
                    <span className={styles.label}>Loteria:</span>
                    <span className={styles.value}>{winner.loteria}</span>
                </div>
                <div className={styles.numbers}>
                    <span className={styles.label}>Números Sorteados:</span>
                    <div className={styles.numbersList}>
                        {winner.numbers.map((num) => (
                            <span key={num} className={styles.number}>
                                {num}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <span className={styles.sorteioDate}>
                    Sorteio: {dateSorteio.toLocaleDateString("pt-BR")}
                </span>
                <span className={styles.betPlacedDate}>
                    Apostado em: {dateAposta.toLocaleString("pt-BR")}
                </span>
            </div>
        </div>
    );
};

export default GanhadorCard;
