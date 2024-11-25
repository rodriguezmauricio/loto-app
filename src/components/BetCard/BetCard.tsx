// components/betCard/BetCard.tsx

import React from "react";
import styles from "./BetCard.module.scss";

interface BetCardProps {
    bet: {
        id: string;
        numbers: number[];
        modalidade: string;
        acertos: number;
        premio: number;
        consultor: string;
        apostador: string;
        quantidadeDeDezenas: number;
        resultado: string; // ISO date string
        data: string; // ISO date string
        hora: string; // ISO date string
        lote: string;
        tipoBilhete: string;
    };
}

const BetCard: React.FC<BetCardProps> = ({ bet }) => {
    // Format dates
    const resultadoDate = bet.resultado ? new Date(bet.resultado) : null;
    const dataDate = bet.data ? new Date(bet.data) : null;
    const horaDate = bet.hora ? new Date(bet.hora) : null;

    return (
        <div className={styles.card}>
            <h3 className={styles.modalidade}>{bet.modalidade}</h3>
            <p className={styles.numbers}>
                Números: {bet.numbers.sort((a, b) => a - b).join(", ")}
            </p>
            <p>Quantidade de Dezenas: {bet.quantidadeDeDezenas}</p>
            {resultadoDate && <p>Data do Resultado: {resultadoDate.toLocaleDateString()}</p>}
            {dataDate && <p>Data da Aposta: {dataDate.toLocaleDateString()}</p>}
            {horaDate && <p>Hora da Aposta: {horaDate.toLocaleTimeString()}</p>}
            <p className={styles.p}>Consultor: {bet.consultor}</p>
            <p className={styles.p}>Lote: {bet.lote}</p>
            <p className={styles.p}>Tipo do Bilhete: {bet.tipoBilhete}</p>
            <p className={styles.p}>Acertos: {bet.acertos}</p>
            <p className={styles.p}>Prêmio: R$ {bet.premio.toFixed(2)}</p>
            {/* Add any additional information or actions */}
        </div>
    );
};

export default BetCard;
