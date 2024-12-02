import styles from "./numbersSorteio.module.scss";

const NumbersSorteio = ({ numero, big }: { numero: number; big: boolean }) => {
    return <div className={big ? styles.container : styles.containerSmall}>{numero}</div>;
};

export default NumbersSorteio;
