import { BsBoxArrowInRight, BsCurrencyDollar } from "react-icons/bs";
import styles from "./configOptionsCard.module.css";
import React from "react";
import SwitchButton from "../switchButton/SwitchButton";
import Link from "next/link";

interface IConfigOptionsCard {
  type: "button" | "switch" | "number" | "money" | "date" | "time";
  icon: React.ReactNode;
  text: string;
  linkTo?: URL | string | undefined;
}

const ConfigOptionsCard = ({ type, icon, text, linkTo }: IConfigOptionsCard) => {
  const renderFunction = (type: string) => {
    if (type === "button") {
      return <BsBoxArrowInRight size={20} />;
    }
    if (type === "switch") {
      return <SwitchButton />;
    }
    if (type === "number") {
      return <input className={styles.input} type="number" name="number" placeholder="20" />;
    }
    if (type === "money") {
      return <input className={styles.input} type="number" name="money" placeholder="50" />;
    }
    if (type === "date") {
      return <input className={styles.input} type="date" name="date" />;
    }
    if (type === "time") {
      return <input className={styles.input} type="time" name="time" />;
    }
  };

  return (
    <Link
      href={linkTo ? linkTo : ""}
      className={type === "button" ? `${styles.tableRow} ${styles.effects}` : styles.tableRow}
    >
      {icon}
      <div className={styles.textoDiv}>
        <p>{text}</p>
      </div>
      {renderFunction(type)}
    </Link>
  );
};

export default ConfigOptionsCard;
