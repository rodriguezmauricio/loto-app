import styles from "./sorteioTable.module.css";

interface ISorteioTable {}

const SorteioTable = () => {
  return (
    <main className={styles.container}>
      <section>
        {/* //TODO: Map through the data of the table */}
        <header className={styles.cellsHeader}>26 Janeiro 2024</header>
        <div className={styles.cellsLine}>
          <div className={styles.cellsLineContent}>
            <p>Bilhete</p>
            <div className={styles.money}>
              <p>R$1,00</p>
            </div>
          </div>
          <div className={styles.cellsLineContent}>
            <p>6 acertos</p>
            <div className={styles.money}>
              <p>R$4.000,00</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SorteioTable;
