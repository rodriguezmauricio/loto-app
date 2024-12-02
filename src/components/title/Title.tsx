import { ReactChild } from "react";
import styles from "./title.module.scss";

interface ITitle {
    h: 1 | 2 | 3;
    children: ReactChild;
}

const Title = ({ h, children }: ITitle) => {
    const applyStyle = () => {
        if (h === 1) {
            return styles.h1;
        }
        if (h === 2) {
            return styles.h2;
        }
        if (h === 3) {
            return styles.h3;
        }
    };

    return <div className={`row ${applyStyle()}`}>{children}</div>;
};

export default Title;
