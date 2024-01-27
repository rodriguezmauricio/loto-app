import ResultsCard from "@/app/components/resultsCard/ResultsCard";
import styles from "./resultados.module.css";

import PageHeader from "@/app/components/pageHeader/PageHeader";

const ResultadosPage = () => {
  return (
    <section className="main">
      <PageHeader title="Resultados" subpage={false} linkTo={""} />

      <section className={styles.resultsList}>
        <ResultsCard />
      </section>
    </section>
  );
};

export default ResultadosPage;
