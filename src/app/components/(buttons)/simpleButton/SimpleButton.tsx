import { ButtonHTMLAttributes } from "react";
import styles from "./simpleButton.module.css";

interface ISimpleButton {
  btnTitle: string;
  isSelected: boolean;
  func: () => void;
}

interface MyISimpleButton extends ButtonHTMLAttributes<HTMLButtonElement>, ISimpleButton {}

const SimpleButton: React.FC<MyISimpleButton> = (props: MyISimpleButton) => {
  const { btnTitle, isSelected, func, ...buttonProps } = props;

  return (
    <button
      className={`${styles.button} ${isSelected ? styles.selectedButton : ""}`}
      {...buttonProps}
      onClick={func}
    >
      {btnTitle}
    </button>
  );
};

export default SimpleButton;
