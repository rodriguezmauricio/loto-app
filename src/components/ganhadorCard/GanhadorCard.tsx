import React from "react";
import styles from "./GanhadorCard.module.scss";
import NumbersSorteio from "components/numbersSorteio/NumbersSorteio";

interface IGanhadorCard {
    username: string;
    numbers: number[];
    prize: string;
    modalidade: string;
    sorteioDate: string;
    betPlacedDate: string; // New prop
}

const GanhadorCard = ({
    username,
    numbers,
    prize,
    modalidade,
    sorteioDate,
    betPlacedDate,
}: IGanhadorCard) => {
    // Format the betPlacedDate to a more readable format, e.g., DD/MM/YYYY HH:MM
    let formattedBetDate: string;
    const dateObj = new Date(betPlacedDate);
    if (!isNaN(dateObj.getTime())) {
        formattedBetDate = dateObj.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } else {
        formattedBetDate = "Data desconhecida";
    }

    return (
        <article className={styles.container}>
            <div className={styles.header}>
                <div className={styles.user}>Usuário: {username}</div>
                <div className={styles.prize}>Prêmio: R${prize}</div>
            </div>
            <div className={styles.modalidade}>Modalidade: {modalidade}</div>
            <div className={styles.dateInfo}>Data do Sorteio: {sorteioDate}</div>
            <div className={styles.betInfo}>
                <div className={styles.betPlaced}>Aposta realizada em: {formattedBetDate}</div>
            </div>
            <div className={styles.numbersContainer}>
                <div className={styles.numberTitle}>Números:</div>
                <div className={styles.numbers}>
                    {numbers.map((num) => (
                        <NumbersSorteio big={false} numero={num} key={num} />
                    ))}
                </div>
            </div>
        </article>
    );
};

export default GanhadorCard;
