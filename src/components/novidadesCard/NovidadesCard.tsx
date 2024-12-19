import React from "react";
import styles from "./NovidadesCard.module.scss";

const NovidadesCard = ({ date, content }: { date: string; content: string }) => {
    return (
        <div className={styles.container}>
            <div className={styles.date}>Data: {date}</div>
            <div className={styles.content}>{content}</div>
        </div>
    );
};

export default NovidadesCard;
