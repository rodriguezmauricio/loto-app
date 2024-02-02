"use client";

import Title from "@/app/components/title/Title";
import styles from "./novoBilhete.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import IconCard from "@/app/components/iconCard/IconCard";
import ChooseNumbersComp from "@/app/components/chooseNumbersComp/ChooseNumbersComp";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { useState } from "react";
import { string } from "yup";

const NovoBilhete = () => {
  const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");

  const handleSelectedBilhete = (selected: string) => {
    setAddBilheteSelectedButton(selected);
  };

  const addBilheteCompToRender = (button: string) => {
    if (button === "importar") {
      return <textarea className={styles.textArea} name="" id="" cols={30} rows={12}></textarea>;
    }

    if (button === "manual") {
      return <ChooseNumbersComp numbersToRender={25} selectionLimit={10} />;
    }
  };

  return (
    <>
      <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
      <main className="main">
        <section className={styles.row}></section>

        <section>
          <Title h={2}>Sorteios</Title>
          <section className={styles.buttonFilterRow}>
            <TabsWithFilters />
          </section>

          <section>
            <IconCard
              icon="lotto"
              title="Titulo do sorteio"
              description="data e hora do sorteio"
              hasCheckbox={false}
              inIcon={false}
              fullWidth
            />
          </section>
        </section>

        <section>
          <Title h={2}>Valor do Bilhete</Title>
          <section className={styles.inputsRow}>
            <select className={styles.input}>
              <option value="teste">1,00</option>
              <option value="teste">2,00</option>
              <option value="teste">3,00</option>
            </select>
            <span>X</span>
            <select className={styles.input}>
              <option value="teste">1</option>
              <option value="teste">5</option>
            </select>
            =<span>R$ XX,00</span>
          </section>
        </section>

        <section className={styles.jogosRow}>
          <div>
            {/* <Title h={2}>Jogos</Title> */}
            <div className={styles.buttonRow}>
              <SimpleButton
                isSelected={addBilheteSelectedButton === "importar"}
                btnTitle="Importar"
                func={() => handleSelectedBilhete("importar")}
              />
              <SimpleButton
                isSelected={addBilheteSelectedButton === "manual"}
                btnTitle="Adicionar Manualmente"
                func={() => handleSelectedBilhete("manual")}
              />
            </div>

            <div className="">{addBilheteCompToRender(addBilheteSelectedButton)}</div>
          </div>
        </section>
      </main>
    </>
  );
};

export default NovoBilhete;
