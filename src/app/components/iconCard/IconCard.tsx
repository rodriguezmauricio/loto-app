import React from "react";
import styles from "./iconCard.module.css";
import { BsPerson, BsPersonBadge, BsBoxArrowInRight, BsWallet2, BsFilter } from "react-icons/bs";

interface IIconCard {
  title: string;
  description: string;
  icon: "user" | "vendor" | "wallet" | "filter";
  inIcon: boolean;
}

const IconCard = ({ title, description, icon, inIcon }: IIconCard) => {
  const ICON_SIZE = 30;

  const renderIcon = (icon: string) => {
    if (icon === "user") {
      return <BsPerson size={ICON_SIZE} />;
    }
    if (icon === "vendor") {
      return <BsPersonBadge size={ICON_SIZE} />;
    }
    if (icon === "wallet") {
      return <BsWallet2 size={ICON_SIZE} />;
    }
    if (icon === "filter") {
      return <BsFilter size={ICON_SIZE} />;
    }
  };

  return (
    <button className={styles.container}>
      <div className={styles.icon}>{renderIcon(icon)}</div>
      <div className={styles.divider}></div>
      <div className={styles.infos}>
        <p className={styles.title}>{title}</p>
        <p>{description}</p>
      </div>
      {inIcon && <div className={styles.icon}>{<BsBoxArrowInRight size={30} />}</div>}
    </button>
  );
};

export default IconCard;