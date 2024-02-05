"use client";
import React, { useState } from "react";
import styles from "./iconCard.module.css";
import {
  BsPerson,
  BsPersonBadge,
  BsBoxArrowInRight,
  BsWallet2,
  BsFilter,
  BsCurrencyDollar,
  BsBarChart,
  BsClock,
  BsTicketPerforated,
} from "react-icons/bs";
import Link from "next/link";
import { Url } from "url";
import { FaClover } from "react-icons/fa6";

export interface IIconCard {
  title: string;
  description: string;
  icon: "user" | "vendor" | "wallet" | "filter" | "charts" | "money" | "lotto" | "clock" | "ticket";
  inIcon?: boolean;
  hasCheckbox?: boolean;
  fullWidth?: boolean;
  linkTo?: Url | string;
  isClickable?: boolean;
}

const IconCard = ({
  title,
  description,
  icon,
  inIcon = false,
  fullWidth = false,
  linkTo = "",
  hasCheckbox = false,
  isClickable = true,
}: IIconCard) => {
  const ICON_SIZE = 30;

  const [checked, setChecked] = useState(true);

  const handleChecked = () => {
    setChecked(!checked);
  };

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
    if (icon === "money") {
      return <BsCurrencyDollar size={ICON_SIZE} />;
    }
    if (icon === "charts") {
      return <BsBarChart size={ICON_SIZE} />;
    }
    if (icon === "lotto") {
      return <FaClover size={ICON_SIZE} />;
    }
    if (icon === "clock") {
      return <BsClock size={ICON_SIZE} />;
    }
    if (icon === "ticket") {
      return <BsTicketPerforated size={ICON_SIZE} />;
    }
  };

  const renderClassnames = (fullWidth: boolean, isClickable: boolean) => {
    let appliedStyles = styles.container;

    if (isClickable === false) {
      appliedStyles = styles.containerNoAnimation;
    }

    if (fullWidth) {
      appliedStyles = `${appliedStyles} ${styles.containerFullWidth}`;
    }

    return appliedStyles;
  };

  return (
    <>
      {isClickable ? (
        <Link href={linkTo}>
          <button className={renderClassnames(fullWidth, isClickable)}>
            <div className={styles.icon}>{renderIcon(icon)}</div>
            <div className={styles.divider}></div>
            <div className={styles.infos}>
              <p className={styles.title}>{title}</p>
              <p>{description}</p>
            </div>
            {inIcon && <div className={styles.icon}>{<BsBoxArrowInRight size={30} />}</div>}
            {hasCheckbox && (
              <div className={"checkbox"}>
                {
                  <input
                    className={"checkbox"}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChecked}
                  />
                }
              </div>
            )}
          </button>
        </Link>
      ) : (
        <button className={renderClassnames(fullWidth, isClickable)}>
          <div className={styles.icon}>{renderIcon(icon)}</div>
          <div className={styles.divider}></div>
          <div className={styles.infos}>
            <p className={styles.title}>{title}</p>
            <p>{description}</p>
          </div>
          {inIcon && <div className={styles.icon}>{<BsBoxArrowInRight size={30} />}</div>}
          {hasCheckbox && (
            <div className={"checkbox"}>
              {
                <input
                  className={"checkbox"}
                  type="checkbox"
                  checked={checked}
                  onChange={handleChecked}
                />
              }
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default IconCard;
