import Card from "../card/Card";
import Title from "../title/Title";
import styles from "./ganhadoresTable.module.css";

interface IGanhadoresTable {}

const GanhadoresTable = () => {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Title h={2}>Ganhadores</Title>
        <span className={styles.subtitle}>AGS alternativas</span>
      </header>

      <section>
        {/* //TODO: Map through the data of the table */}
        <div className={styles.resultsRow}>
          <Card
            title="Data dos Sorteios"
            value={"27 Janeiro 2024"}
            color="none"
            big={false}
            money={false}
          />
          <Card title="Bilhetes premiados" value={0} color="yellow" big={false} money={false} />
          <Card title="Total em premiações" value={0} color="red" big={false} money={true} />
        </div>
      </section>
    </main>
  );
};

export default GanhadoresTable;
