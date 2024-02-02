import { ButtonHTMLAttributes } from "react";
import styles from "./simpleButton.module.css";
import { BsDownload, BsSave } from "react-icons/bs";

interface ISimpleButton {
  btnTitle: string;
  isSelected: boolean;
  hasIcon?: boolean;
  iconType?: "download" | "save";
  func: () => void;
}

interface MyISimpleButton extends ButtonHTMLAttributes<HTMLButtonElement>, ISimpleButton {}

const SimpleButton: React.FC<MyISimpleButton> = (props: MyISimpleButton) => {
  const { btnTitle, isSelected, hasIcon = false, iconType, func, ...buttonProps } = props;

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
      className={`${styles.button} ${isSelected ? styles.selectedButton : ""}`}
      {...buttonProps}
      onClick={func}
    >
      {hasIcon && renderIcon()}
      {btnTitle}
    </button>
  );
};

export default SimpleButton;
