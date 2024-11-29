import styles from "./card.module.css";

interface ICard {
    title: string;
    value: number | string;
    big: boolean;
    color: "green" | "red" | "yellow" | "none";
    money?: boolean;
    children?: React.ReactNode;
}

const Card = ({ title, value, big, color, money = true, children }: ICard) => {
    // Format the value as currency
    const formattedValue =
        value !== undefined
            ? value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
              })
            : "R$ 0,00";

    const styleCombination = (big: boolean, color: string) => {
        if (color === "green") {
            return styles.container, styles.borderLeftGreen;
        }
        if (color === "yellow") {
            return styles.container, styles.borderLeftYellow;
        }
        if (color === "red") {
            return styles.container, styles.borderLeftRed;
        }
        if (color === "none") {
            return styles.container;
        }
    };
    return (
        <div className={`${styles.card} ${styles[color]} ${big ? styles.big : ""}`}>
            <h3>{title}</h3>
            <h2 className={styles.h2}>{title}</h2>
            <h3 className={big ? styles.h3Main : styles.h3}>{formattedValue}</h3>
            {children && <div className={styles.children}>{children}</div>}
        </div>
    );
};

export default Card;
