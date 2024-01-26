"use client";
import styles from "./ganhadores.module.css";
import PageHeader from "../components/pageHeader/PageHeader";
import ResultsTable from "../components/resultsTable/ResultsTable";
import Tabs from "../components/tabs/Tabs";
import Buttons from "../components/buttons/Buttons";
import { useState } from "react";

const GanhadoresPage = () => {
  const [pix, setPix] = useState(true);

  //TODO: Fetch data from the winners

  const handleShowPix = () => {
    setPix((prev) => !prev);
  };

  const testArr = [
    {
      tabTitle: "Caixa",
      tabContent: <ResultsTable />,
    },
    {
      tabTitle: "Sabedoria",
      tabContent: <ResultsTable />,
    },
    {
      tabTitle: "Personalizado",
      tabContent: <ResultsTable />,
    },
  ];

  return (
    <section className={styles.main}>
      <PageHeader title="Ganhadores" subpage={false} />

      <section>
        <div className={styles.buttonsRow}>
          <Buttons type="share" onClick={() => console.log("tá funfando")} />
          <Buttons type="date" />
          <Buttons type="vendor" />
          {pix ? (
            <Buttons type="showPix" onClick={handleShowPix} />
          ) : (
            <Buttons type="hidePix" onClick={handleShowPix} />
          )}
        </div>
        <Tabs tabArray={testArr} />
      </section>
    </section>
  );
};

export default GanhadoresPage;
