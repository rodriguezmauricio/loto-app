import styles from "./buttons.module.css";
import {
  BsArrowRepeat,
  BsCurrencyDollar,
  BsPlus,
  BsShare,
  BsTrash2,
  BsWallet2,
} from "react-icons/bs";

import { TbCurrencyDollarOff, TbWalletOff } from "react-icons/tb";

interface IButtons {
  type: "add" | "share" | "delete" | "repeat" | "addMoney" | "removeMoney" | "deactivateWallet";
}

const Buttons = ({ type }: IButtons) => {
  const renderIcon = (type: string) => {
    const ICON_SIZE = 30;
    if (type === "add") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.addButton}>
            <BsPlus size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Adicionar</p>
            <p className={styles.text}>Bilhete</p>
          </div>
        </div>
      );
    }
    if (type === "share") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.shareButton}>
            <BsShare size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Compartilhar</p>
            <p className={styles.text}>Bilhete</p>
          </div>
        </div>
      );
    }
    if (type === "delete") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.deleteButton}>
            <BsTrash2 size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Excluir</p>
            <p className={styles.text}>Bilhetes</p>
          </div>
        </div>
      );
    }
    if (type === "repeat") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.repeatButton}>
            <BsArrowRepeat size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Jogar</p>
            <p className={styles.text}>Novamente</p>
          </div>
        </div>
      );
    }
    if (type === "addMoney") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.addMoney}>
            <BsCurrencyDollar size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Adicionar</p>
            <p className={styles.text}>Crédito</p>
          </div>
        </div>
      );
    }
    if (type === "removeMoney") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.removeMoney}>
            <TbCurrencyDollarOff size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Remover</p>
            <p className={styles.text}>Crédito</p>
          </div>
        </div>
      );
    }
    if (type === "deactivateWallet") {
      //TODO: Add functionality

      return (
        <div className={styles.container}>
          <button className={styles.deactivateWallet}>
            <TbWalletOff size={ICON_SIZE} />
          </button>
          <div className={styles.col}>
            <p className={styles.text}>Desativar</p>
            <p className={styles.text}>Carteira</p>
          </div>
        </div>
      );
    }
  };

  return renderIcon(type);
};

export default Buttons;
