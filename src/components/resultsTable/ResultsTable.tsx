import styles from "./resultsTables.module.css";

interface IResultsTable {}

const ResultsTable = () => {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h2>AGS Alternativas • Dupla Sena</h2>

        <p>descrição de como funciona o jogo da tabela e combinações e etc.</p>
      </header>

      <section>
        {/* //TODO: Map through the data of the table */}
        <header className={styles.cellsHeader}>10 Dezenas</header>
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

export default ResultsTable;
