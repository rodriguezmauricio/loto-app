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
      <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
      <main className="main">
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
              fullWidth
              isClickable={false}
            />
          </section>
        </section>

        <section>
          <Title h={2}>Bilhetes</Title>
          <section className={styles.inputsRow}>
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
            <div className={styles.valorBilheteDiv}>
              Valor do bilhete:
              <select
                className={styles.input}
                value={valorBilhete.valor}
                onChange={handleValorBilhete}
                name="valor"
              >
                <option value={1}>1,00</option>
                <option value={2}>2,00</option>
                <option value={3}>3,00</option>
              </select>
              <span>X</span>
              <select
                className={styles.input}
                name="quantidade"
                value={valorBilhete.quantidade}
                onChange={handleValorBilhete}
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
              </select>
              =<span>R$ {valorBilhete.quantidade * valorBilhete.valor}</span>
            </div>
          </section>
        </section>

        <section className={styles.jogosRow}>
          <div className={addBilheteSelectedButton === "importar" ? styles.compDiv : ""}>
            {addBilheteCompToRender(addBilheteSelectedButton)}
          </div>
          <div className={styles.instructionsDiv}>
            {addBilheteSelectedButton === "importar" && (
              <div>
                <Title h={3}>Instruções:</Title>
                <li>Adicione cada jogo entre parenteses.</li>
                <li>Para mais de um jogo, coloque um sinal de + entre os jogos.</li>
                <li>Cada número deve estar separado por uma vírgula.</li>
                <li>Exemplo: (1,2,3,4,5,6,7) + (1,3,8,10,12,18) + (1,2,5,6,9,12)...</li>
              </div>
            )}
            {addBilheteSelectedButton === "manual" && (
              <div>
                <Title h={3}>Instruções:</Title>
                <li>Adicione cada jogo entre parenteses.</li>
                <li>Para mais de um jogo, coloque um sinal de + entre os jogos.</li>
                <li>Cada número deve estar separado por uma vírgula.</li>
                <li>Exemplo: (1,2,3,4,5,6,7) + (1,3,8,10,12,18) + (1,2,5,6,9,12)...</li>
              </div>
            )}

            <div className={styles.buttonRow}>
              <SimpleButton
                style={{ backgroundColor: "#00A67F" }}
                btnTitle="Salvar jogos importados"
                func={() => console.log(sendForm(addBilheteSelectedButton))}
                iconType="save"
                hasIcon
                isSelected={false}
              />
            </div>
          </div>
        </section>
        {addBilheteSelectedButton === "importar" && (
          <div className={styles.checkJogosDiv}>
            <Title h={3}>{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
            {importedNumbersArr.map((item: any, index) => {
              return (
                <IconCard
                  title={`Jogo ${index + 1}`}
                  description={item.join(", ")}
                  fullWidth
                  inIcon={false}
                  hasCheckbox={false}
                  icon="lotto"
                  isClickable={false}
                  key={item.join()}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default NovoBilhete;
