"use client";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./tabelasDePremiacoes.module.css";
import TabsWithFilters from "components/tabsWithFilters/TabsWithFilters";
import ResultsTable from "components/resultsTable/ResultsTable";

const page = () => {
    return (
        <>
            <PageHeader title="Tabela de Premiações" subpage={false} linkTo={""} />
            <main className="main">
                <section className={styles.container}>
                    <div>
                        <TabsWithFilters />
                    </div>
                    <ResultsTable />
                </section>
            </main>
        </>
    );
};

export default page;
