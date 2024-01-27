import styles from "./numbersSorteio.module.css";

const NumbersSorteio = ({ numero }: { numero: number }) => {
  return <div className={styles.container}>{numero}</div>;
};

export default NumbersSorteio;
