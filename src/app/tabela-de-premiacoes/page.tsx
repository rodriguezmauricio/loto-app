"use client";
import styles from "./tabelasDePremiacoes.module.css";
import TabsWithFilters from "../components/tabsWithFilters/TabsWithFilters";
import PageHeader from "../components/pageHeader/PageHeader";
import ResultsTable from "../components/resultsTable/ResultsTable";

const page = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Tabela de Premiações" subpage />
      <section className={styles.container}>
        <div>
          <TabsWithFilters />
        </div>
        <ResultsTable />
      </section>
    </main>
  );
};

export default page;
