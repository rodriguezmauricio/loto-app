"use client";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./tabelasDePremiacoes.module.css";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import ResultsTable from "@/app/components/resultsTable/ResultsTable";

const page = () => {
  return (
    <main className="main">
      <PageHeader title="Tabela de Premiações" subpage={false} linkTo={""} />
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
