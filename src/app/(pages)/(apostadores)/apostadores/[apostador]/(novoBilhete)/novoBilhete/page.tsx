"use client";
// Marks the component to be rendered on the client side

// Importing required components and CSS styles from the project structure
import Title from "@/app/components/title/Title";
import styles from "./novoBilhete.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import IconCard from "@/app/components/iconCard/IconCard";
import ChooseNumbersComp from "@/app/components/chooseNumbersComp/ChooseNumbersComp";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { useEffect, useState } from "react";

const NovoBilhete = () => {
  const URL = "http://localhost:3500/modalidades";

  // State to track which button (importar/manual) is selected
  const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");

  // State to store manually selected numbers
  const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);

  // State to store imported numbers from text input
  const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]);

  // State to store imported numbers from text input
  const [randomNumbersArr, setRandomNumbersArr] = useState<string[]>([]);

  // State to store the current text value in the text area
  const [textAreaValue, setTextAreaValue] = useState("");

  const [modalidadeSetting, setModalidadeSetting] = useState<object[]>([]);
  const [modalidadeContent, setModalidadeContent] = useState<object>();

  console.log("setting 1: ", modalidadeSetting);

  const handleModalidadeContent = (settingsObj) => {
    setModalidadeContent(settingsObj);
    console.log(settingsObj);
  };

  // Function to handle form submission depending on whether the user selected "importar" or "manual"
  const sendForm = (selected: string) => {
    if (selected === "importar") {
      // Return imported numbers array when "importar" is selected
      return importedNumbersArr;
    }

    if (selected === "manual") {
      // Sort and return selected numbers array when "manual" is selected
      return selectedNumbersArr.sort((a, b) => Number(a) - Number(b));
    }

    if (selected === "randomNumbers") {
      // Sort and return selected numbers array when "manual" is selected
      return randomNumbersArr.sort((a, b) => Number(a) - Number(b));
    }
  };

  // Function to handle text input changes in the text area
  const handleTextAreaContent = (e: any) => {
    setTextAreaValue(e.target.value); // Update the text area value in the state

    const content = e.target.value;
    const trimmedContent = content.replace(/\s/g, ""); // Remove white spaces from the content

    // Find all numbers within parentheses using regex
    const matches = trimmedContent.match(/\((.*?)\)/g);

    if (!matches) {
      return [];
    }

    // Extract and sort the numbers found between parentheses
    const result = matches.map((match: string) => {
      const numbers = match
        .replace(/[()]/g, "") // Remove parentheses
        .split(",") // Split numbers by commas
        .sort((a, b) => Number(a) - Number(b)) // Sort the numbers
        .map(Number); // Convert strings to numbers
      return numbers;
    });

    setImportedNumbersArr(result); // Update the state with the imported numbers
  };

  // State to store the value and quantity of the ticket
  const [valorBilhete, setValorBilhete] = useState({
    valor: 2,
    quantidade: 1,
  });

  // Function to handle changes in ticket value and quantity
  const handleValorBilhete = (event: any) => {
    const { name, value } = event.target;
    // Update the ticket value and quantity based on user selection
    setValorBilhete({
      ...valorBilhete,
      [name]: Number(value),
    });
  };

  // Function to update the selected option (importar or manual)
  const handleSelectedBilhete = (selected: string) => {
    setAddBilheteSelectedButton(selected);
  };

  // Function to render the appropriate component (textarea or number selection) based on user selection
  const addBilheteCompToRender = (button: string) => {
    if (button === "importar") {
      // Render a textarea for importing numbers when "importar" is selected
      return (
        <textarea
          className={styles.textArea}
          placeholder="(1,2,3,4,5,6,7) + (2,5,7,9,10,12,15) + (1,2,3,5,7,8,9)..."
          cols={30}
          rows={12}
          value={textAreaValue}
          onChange={handleTextAreaContent}
        ></textarea>
      );
    }

    if (button === "manual") {
      // Render a number selection component when "manual" is selected
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        setModalidadeSetting(data); // Make sure data is an array
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Page header */}
      <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
      <main className="main">
        {/* Section for lottery draw details */}
        <section>
          <Title h={2}>Sorteios</Title>
          <section className={styles.buttonFilterRow}>
            <TabsWithFilters
              modalidadeSetting={modalidadeSetting}
              handleModalidadeContent={handleModalidadeContent}
            />
          </section>
          <section>
            {/* Display a card with draw details */}
            <IconCard
              icon="lotto"
              title="Titulo do sorteio"
              description="data e hora do sorteio"
              fullWidth
              isClickable={false}
            />
          </section>
        </section>

        {/* Section for ticket options */}
        <section>
          <Title h={2}>Bilhetes</Title>
          <section className={styles.inputsRow}>
            {/* Buttons to choose between importing or adding numbers manually */}
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
              <SimpleButton
                isSelected={addBilheteSelectedButton === "random"}
                btnTitle="Aleatório"
                func={() => handleSelectedBilhete("random")}
              />
            </div>
            {/* Dropdowns for selecting ticket value and quantity */}
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

        {/* Section to render either the text input or the number selection component */}
        <section className={styles.jogosRow}>
          <div className={addBilheteSelectedButton === "importar" ? styles.compDiv : ""}>
            {addBilheteCompToRender(addBilheteSelectedButton)}
          </div>
          {/* Instructions for importing or manually adding numbers */}
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
            {addBilheteSelectedButton === "random" && (
              <div>
                <Title h={3}>Quantidade de Números:</Title>

                <p>{modalidadeContent?.name}</p>
                <p>{modalidadeContent?.color}</p>
                <p>{modalidadeContent?.betNumbers}</p>
                <p>
                  {modalidadeContent?.trevoAmount.length > 1 ? "tem conteudo" : "nao tem conteudo"}
                </p>
              </div>
            )}

            {/* Button to save imported games */}
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

        {/* Section to display the total imported games and other details */}
        {addBilheteSelectedButton === "importar" && (
          <div className={styles.checkJogosDiv}>
            <Title h={3}>{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
            <Title h={3}>{`Cliente: ***nome do cliente***`}</Title>

            {/* Display each imported game */}
            {handleTextAreaContent.length > 0
              ? importedNumbersArr.map((item: any, index) => {
                  return (
                    <div key={index}>
                      {`Jogo ${index + 1} : `}
                      {item.join(", ")}.
                    </div>
                  );

                  //TODO: Activate this card in the final version and remove placeholder code.
                  // <IconCard
                  //   title={`Jogo ${index + 1}`}
                  //   description={item.join(", ")}
                  //   fullWidth
                  //   inIcon={false}
                  //   hasCheckbox={false}
                  //   icon="lotto"
                  //   isClickable={false}
                  //   key={item.join()}
                  // />
                })
              : handleTextAreaContent.length}
          </div>
        )}
        {/* Render the selected numbers if any */}
        {selectedNumbersArr}
      </main>
    </>
  );
};

export default NovoBilhete;
