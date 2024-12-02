import { ReactNode } from "react";
import styles from "./submenuContainer.module.scss";

interface ISubmenuContainer {
    isOpen: boolean;
    children: ReactNode;
}

const SubmenuContainer = ({ isOpen, children }: ISubmenuContainer) => {
    return (
        <>
            <div className={`${styles.container} ${isOpen ? styles.open : ""}`}>{children}</div>
            <div className={isOpen ? styles.overlay : ""}></div>
        </>
    );
};

export default SubmenuContainer;
