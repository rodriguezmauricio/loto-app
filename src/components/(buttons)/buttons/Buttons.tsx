import { ButtonHTMLAttributes } from "react";
import styles from "./buttons.module.scss";
import {
    BsArrowRepeat,
    BsCalendar,
    BsCheck,
    BsCurrencyDollar,
    BsEye,
    BsEyeSlash,
    BsPersonBadge,
    BsPlus,
    BsShare,
    BsTrash2,
    BsXCircle,
} from "react-icons/bs";

import { TbCurrencyDollarOff, TbWalletOff } from "react-icons/tb";
import Link from "next/link";

interface IButtons {
    buttonType:
        | "add"
        | "content"
        | "share"
        | "delete"
        | "repeat"
        | "addMoney"
        | "removeMoney"
        | "deactivateWallet"
        | "date"
        | "vendor"
        | "showPix"
        | "hidePix"
        | "addSorteio"
        | "cancelDelete"
        | "check";
    linkTo?: string;
}

interface MyIButtons extends ButtonHTMLAttributes<HTMLButtonElement>, IButtons {}

const Buttons: React.FC<MyIButtons> = (props: any) => {
    const { buttonType, linkTo, ...otherProps } = props;

    const renderIcon = (type: string) => {
        const ICON_SIZE = 30;
        if (type === "content") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <Link href="/apostadores/apostador/novoBilhete">
                        <button className={`${styles.button} ${styles.addButton}`} {...otherProps}>
                            {/* <BsPlus size={ICON_SIZE} /> */}
                            {props.children}
                        </button>
                    </Link>
                </div>
            );
        }

        if (type === "add") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <Link href="/apostadores/apostador/novoBilhete">
                        <button className={`${styles.button} ${styles.addButton}`} {...otherProps}>
                            <BsPlus size={ICON_SIZE} />
                        </button>
                    </Link>
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
                    <button className={`${styles.button} ${styles.shareButton}`} {...otherProps}>
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
                    <button className={`${styles.button} ${styles.deleteButton}`} {...otherProps}>
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
                    <button className={`${styles.button} ${styles.repeatButton}`} {...otherProps}>
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
                    <button className={`${styles.button} ${styles.addMoney}`} {...otherProps}>
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
                    <button className={`${styles.button} ${styles.removeMoney}`} {...otherProps}>
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
                    <button
                        className={`${styles.button} ${styles.deactivateWallet}`}
                        {...otherProps}
                    >
                        <TbWalletOff size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Desativar</p>
                        <p className={styles.text}>Carteira</p>
                    </div>
                </div>
            );
        }
        if (type === "date") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.date}`} {...otherProps}>
                        <BsCalendar size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Selecionar</p>
                        <p className={styles.text}>Data</p>
                    </div>
                </div>
            );
        }
        if (type === "vendor") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.showVendor}`} {...otherProps}>
                        <BsPersonBadge size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Mostrar</p>
                        <p className={styles.text}>Vendedor</p>
                    </div>
                </div>
            );
        }
        if (type === "showPix") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.addButton}`} {...otherProps}>
                        <BsEye size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Mostrar</p>
                        <p className={styles.text}>Pix</p>
                    </div>
                </div>
            );
        }
        if (type === "hidePix") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button
                        className={`${styles.button} ${styles.deactivateWallet}`}
                        {...otherProps}
                    >
                        <BsEyeSlash size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Ocultar</p>
                        <p className={styles.text}>Pix</p>
                    </div>
                </div>
            );
        }
        if (type === "addSorteio") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.addButton}`} {...otherProps}>
                        <BsPlus size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Adicionar</p>
                        <p className={styles.text}>Sorteio</p>
                    </div>
                </div>
            );
        }
        if (type === "check") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.addButton}`} {...otherProps}>
                        <BsCheck size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Conferir</p>
                        <p className={styles.text}>Bilhete</p>
                    </div>
                </div>
            );
        }

        if (type === "cancelDelete") {
            //TODO: Add functionality

            return (
                <div className={styles.container}>
                    <button className={`${styles.button} ${styles.repeatButton}`} {...otherProps}>
                        <BsXCircle size={ICON_SIZE} />
                    </button>
                    <div className={styles.col}>
                        <p className={styles.text}>Cancelar</p>
                        <p className={styles.text}>Exclusão</p>
                    </div>
                </div>
            );
        }
    };

    return renderIcon(buttonType);
};

export default Buttons;
