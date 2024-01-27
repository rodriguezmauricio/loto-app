import styles from "./card.module.css";

interface ICard {
  title: string;
  value: number | string;
  big: boolean;
  color: "green" | "red" | "yellow" | "none";
  money?: boolean;
}

const Card = ({ title, value, big, color, money = true }: ICard) => {
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
    <div className={styleCombination(big, color)}>
      <h2 className={styles.h2}>{title}</h2>
      <h3 className={big ? styles.h3Main : styles.h3}>
        {money ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : value}
      </h3>
    </div>
  );
};

export default Card;
