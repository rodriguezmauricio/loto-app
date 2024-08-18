import ResultsCard from "@/app/components/resultsCard/ResultsCard";
import styles from "./resultados.module.css";

import PageHeader from "@/app/components/pageHeader/PageHeader";

const ResultadosPage = () => {
  return (
    <>
      <PageHeader title="Resultados" subpage={false} linkTo={""} />
      <main className="main">
        <section className={styles.resultsList}>
          <ResultsCard />
        </section>
      </main>
    </>
  );
};

export default ResultadosPage;
