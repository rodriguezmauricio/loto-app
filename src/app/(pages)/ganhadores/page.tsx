"use client";

import { useState } from "react";

import styles from "./ganhadores.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import Buttons from "@/app/components/buttons/Buttons";
import Tabs from "@/app/components/tabs/Tabs";
import GanhadoresTable from "@/app/components/ganhadoresTable/GanhadoresTable";

const GanhadoresPage = () => {
  const [pix, setPix] = useState(true);

  //TODO: Fetch data from the winners

  const handleShowPix = () => {
    setPix((prev) => !prev);
  };

  const testArr = [
    {
      tabTitle: "Caixa",
      tabContent: <GanhadoresTable />,
    },
    {
      tabTitle: "Sabedoria",
      tabContent: <GanhadoresTable />,
    },
    {
      tabTitle: "Personalizado",
      tabContent: <GanhadoresTable />,
    },
  ];

  return (
    <>
      <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
      <main className="main">
        <section>
          <div className={styles.buttonsRow}>
            <Buttons buttonType="share" onClick={() => console.log("tá funfando")} />
            <Buttons buttonType="date" />
            <Buttons buttonType="vendor" />
            {pix ? (
              <Buttons buttonType="showPix" onClick={handleShowPix} />
            ) : (
              <Buttons buttonType="hidePix" onClick={handleShowPix} />
            )}
          </div>
          <Tabs tabArray={testArr} />
        </section>
      </main>
    </>
  );
};

export default GanhadoresPage;
