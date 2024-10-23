import styles from "./numbersSorteio.module.css";

const NumbersSorteio = ({ numero, big }: { numero: number; big: boolean }) => {
    return <div className={big ? styles.container : styles.containerSmall}>{numero}</div>;
};

export default NumbersSorteio;
