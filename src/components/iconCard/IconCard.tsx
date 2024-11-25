"use client";
import React, { useState } from "react";
import styles from "./iconCard.module.css";
import {
    BsPerson,
    BsPersonBadge,
    BsWallet2,
    BsFilter,
    BsCurrencyDollar,
    BsBoxArrowInRight,
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
    icon:
        | "user"
        | "vendor"
        | "wallet"
        | "filter"
        | "charts"
        | "money"
        | "lotto"
        | "clock"
        | "ticket";
    inIcon?: boolean;
    fullWidth?: boolean;
    linkTo?: string;
    hasCheckbox?: boolean;
    isClickable?: boolean;
    extraInfo?: string;
    searchTerm?: string;
    onClick?: () => void;
    children?: React.ReactNode;
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
    extraInfo = "",
    searchTerm,
    onClick,
}: IIconCard) => {
    const ICON_SIZE = 30;

    const [checked, setChecked] = useState<boolean>(false);

    const handleChecked = () => {
        setChecked(!checked);
    };

    const renderIcon = (icon: string) => {
        switch (icon) {
            case "user":
                return <BsPerson size={ICON_SIZE} />;
            case "vendor":
                return <BsPersonBadge size={ICON_SIZE} />;
            case "wallet":
                return <BsWallet2 size={ICON_SIZE} />;
            case "filter":
                return <BsFilter size={ICON_SIZE} />;
            case "money":
                return <BsCurrencyDollar size={ICON_SIZE} />;
            case "charts":
                return <BsBarChart size={ICON_SIZE} />;
            case "lotto":
                return <FaClover size={ICON_SIZE} />;
            case "clock":
                return <BsClock size={ICON_SIZE} />;
            case "ticket":
                return <BsTicketPerforated size={ICON_SIZE} />;
            default:
                return null;
        }
    };

    const renderClassnames = (fullWidth: boolean, isClickable: boolean) => {
        let appliedStyles = styles.container;

        if (!isClickable) {
            appliedStyles = styles.containerNoAnimation;
        }

        if (fullWidth) {
            appliedStyles = `${appliedStyles} ${styles.containerFullWidth}`;
        }

        return appliedStyles;
    };

    const cardContent = (
        <div className={styles.cardContent}>
            <div className={styles.icon}>{renderIcon(icon)}</div>
            <div className={styles.divider}></div>
            <div className={styles.infos}>
                <p className={styles.title}>{title}</p>
                <p>{description}</p>
                {extraInfo && <p className={styles.extraInfo}>{extraInfo}</p>}
            </div>
            {inIcon && (
                <div className={styles.icon}>
                    <BsBoxArrowInRight size={30} />
                </div>
            )}
            {hasCheckbox && (
                <div className={styles.checkboxContainer}>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        checked={checked}
                        onChange={handleChecked}
                    />
                </div>
            )}
        </div>
    );

    const classNames = renderClassnames(fullWidth, isClickable);

    if (linkTo && isClickable) {
        // Render as Link wrapping a div
        return (
            <Link href={linkTo}>
                <div className={classNames}>{cardContent}</div>
            </Link>
        );
    } else if (onClick && isClickable) {
        // Render as button with onClick
        return (
            <button className={classNames} onClick={onClick}>
                {cardContent}
            </button>
        );
    } else {
        // Render as div
        return <div className={classNames}>{cardContent}</div>;
    }
};

export default IconCard;
