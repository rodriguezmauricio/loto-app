// components/ganhadoresCards/GanhadoresCards.tsx

import React from "react";
import WinnerCard from "../winnerCard/WinnerCard";
import styles from "./GanhadoresCards.module.scss";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    username: string;
    sorteioDate: string;
    premio: number;
}

interface GanhadoresCardsProps {
    winners: WinnerBet[];
    loading: boolean;
}

const GanhadoresCards: React.FC<GanhadoresCardsProps> = ({ winners, loading }) => {
    if (loading) {
        return <p>Carregando ganhadores...</p>;
    }

    if (winners.length === 0) {
        return <p>Nenhum ganhador encontrado.</p>;
    }
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Ganhadores</h2>
                <span className={styles.subtitle}>
                    {loading ? "Carregando ganhadores..." : "Lista de ganhadores"}
                </span>
            </header>

            <section>
                {/* Summary Cards */}
                <div className={styles.summaryRow}>
                    {/* Reuse your existing Card components for summaries if needed */}
                    {/* Example: */}
                    {/* <Card title="Total Ganhadores" value={winners.length} color="yellow" /> */}
                    {/* Add more summary cards as needed */}
                </div>

                {/* Winners Cards */}
                {loading ? (
                    <p>Carregando ganhadores...</p>
                ) : winners.length === 0 ? (
                    <p>Nenhum ganhador encontrado para os filtros selecionados.</p>
                ) : (
                    <div className={styles.cardsGrid}>
                        {winners.map((winner) => (
                            <WinnerCard key={winner.id} winner={winner} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default GanhadoresCards;
