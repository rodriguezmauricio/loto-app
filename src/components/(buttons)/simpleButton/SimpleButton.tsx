import { ButtonHTMLAttributes } from "react";
import styles from "./simpleButton.module.scss";
import { BsDownload, BsSave } from "react-icons/bs";

interface ISimpleButton {
    btnTitle: string;
    isSelected: boolean;
    hasIcon?: boolean;
    iconType?: "download" | "save";
    func: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset"; // Add type prop
    danger?: boolean;
}

interface MyISimpleButton extends ButtonHTMLAttributes<HTMLButtonElement>, ISimpleButton {}

const SimpleButton: React.FC<MyISimpleButton> = (props: MyISimpleButton) => {
    const {
        btnTitle,
        isSelected,
        hasIcon = false,
        iconType,
        func,
        className = "",
        disabled = false,
        danger = false,
        type = "button", // Default type is "button"
        ...buttonProps
    } = props;

    const renderIcon = () => {
        if (iconType === "download") {
            return <BsDownload size={22} />;
        }

        if (iconType === "save") {
            return <BsSave size={22} />;
        }
    };
    return (
        <button
            className={`${styles.button} ${isSelected ? styles.selected : ""} ${className} ${
                danger ? styles.danger : ""
            }`}
            {...buttonProps}
            onClick={func}
        >
            {hasIcon && renderIcon()}
            {btnTitle}
        </button>
    );
};

export default SimpleButton;
