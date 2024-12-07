import React from "react";
import styles from "./GanhadorCard.module.scss";
import NumbersSorteio from "components/numbersSorteio/NumbersSorteio";

interface IGanhadorCard {
    username: string;
    numbers: number[];
    prize: string;
}

const GanhadorCard = ({ username, numbers, prize }: IGanhadorCard) => {
    return (
        <article className={styles.container}>
            <div className={styles.header}>
                <div className={styles.user}>usuario: {username}</div>
                <div className={styles.prize}>prêmio: {prize}</div>
            </div>
            <div className={styles.numbersContainer}>
                <div className={styles.numberTitle}>Números:</div>
                <div className={styles.numbers}>
                    {numbers.map((num) => {
                        return <NumbersSorteio big={false} numero={num} key={num} />;
                    })}
                </div>
            </div>
        </article>
    );
};

export default GanhadorCard;
