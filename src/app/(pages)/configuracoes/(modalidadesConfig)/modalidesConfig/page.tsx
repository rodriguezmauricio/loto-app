"use client";

import Title from "@/app/components/title/Title";
import styles from "./novoBilhete.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import IconCard from "@/app/components/iconCard/IconCard";
import ChooseNumbersComp from "@/app/components/chooseNumbersComp/ChooseNumbersComp";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { useState } from "react";

const NovoBilhete = () => {
  const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");
  const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);
  const [importedNumbersArr, setimportedNumbersArr] = useState<string[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  //action that runs when press the "salvar jogos importados" button.
  const sendForm = (selected: string) => {
    if (selected === "importar") {
      return importedNumbersArr;
    }

    if (selected === "manual") {
      return selectedNumbersArr.sort((a, b) => Number(a) - Number(b));
    }
  };

  const handleTextAreaContent = (e: any) => {
    setTextAreaValue(e.target.value);

    const content = e.target.value;
    // Remove white spaces
    const trimmedContent = content.replace(/\s/g, "");

    // Find all matches of numbers inside parentheses
    const matches = trimmedContent.match(/\((.*?)\)/g);

    if (!matches) {
      return [];
    }

    // Extract numbers from each match
    const result = matches.map((match: string) => {
      const numbers = match
        .replace(/[()]/g, "")
        .split(",")
        .sort((a, b) => Number(a) - Number(b))
        .map(Number);
      return numbers;
    });

    setimportedNumbersArr(result);
  };

  const [valorBilhete, setValorBilhete] = useState({
    valor: 2,
    quantidade: 1,
  });

  const handleValorBilhete = (event: any) => {
    const { name, value } = event.target;
    setValorBilhete({
      ...valorBilhete,
      [name]: Number(value),
    });
  };

  const handleSelectedBilhete = (selected: string) => {
    setAddBilheteSelectedButton(selected);
  };

  const addBilheteCompToRender = (button: string) => {
    if (button === "importar") {
      return (
        <textarea
          className={styles.textArea}
          placeholder="(1,2,3,4,5,6,7) + (2,5,7,9,10,12,15) + (1,2,3,5,7,8,9)..."
          name=""
          id=""
          cols={30}
          rows={12}
          value={textAreaValue}
          onChange={handleTextAreaContent}
        ></textarea>
      );
    }

    if (button === "manual") {
      return (
        <ChooseNumbersComp
          numbersToRender={25}
          selectionLimit={10}
          numbersArr={selectedNumbersArr}
          numbersArrSetter={setSelectedNumbersArr}
        />
      );
    }
  };

  return (
    <>
      <PageHeader title="Modalidades {modalidade}" subpage={false} linkTo="" />
      <main className="main">
        <section>
          <Title h={2}>Sorteios</Title>
          <section>
            <IconCard
              icon="lotto"
              title="Titulo do sorteio"
              description="data e hora do sorteio"
              fullWidth
              isClickable={false}
            />
          </section>
        </section>
      </main>
    </>
  );
};

export default NovoBilhete;
