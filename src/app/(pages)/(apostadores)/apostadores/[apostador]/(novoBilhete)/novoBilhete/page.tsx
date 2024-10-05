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
import { useEffect, useState, useRef } from "react";
import Buttons from "@/app/components/(buttons)/buttons/Buttons";
import { tempDb } from "@/tempDb"; // Import tempDb
import ResultsCard from "@/app/components/resultsCard/ResultsCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DownloadPDFButton from "@/app/components/(buttons)/downloadPdfButton/DownloadPdfButton";

export interface IModalidade {
  name: string;
  color: string;
  betNumbers: number[];
  trevoAmount: number[];
  maxNumber: number;
}

const NovoBilhete = () => {
  // State to track which button (importar/manual) is selected
  const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");

  //currentDate
  const [currentDate, setCurrentDate] = useState(new Date());

  const [acertos, setAcertos] = useState(0);
  const [premio, setPremio] = useState(0);
  const [apostador, setApostador] = useState("");
  const [tipoBilhete, setTipoBilhete] = useState(0);
  const [dataResultado, setDataResultado] = useState<Date | null>(new Date());

  // State to store manually selected numbers
  const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);

  // State to store imported numbers from text input
  const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]);

  // State to store imported numbers from text input
  const [randomNumbersArr, setRandomNumbersArr] = useState<string[]>([]);

  const [nomeConsultor, setNomeVendedor] = useState<string>("");

  const [numeroBilhete, setNumeroBilhete] = useState<number>(0);

  // State to store the current text value in the text area
  const [textAreaValue, setTextAreaValue] = useState("");

  // const [modalidadeSetting, setModalidadeSetting] = useState<IModalidade[]>([]);
  const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);

  const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();

  const [selectedJogos, setSelectedJogos] = useState<number>(1); // Only one selected number

  const [generatedGames, setGeneratedGames] = useState<number[][]>([]); // Store 5 games

  const [numberOfGames, setNumberOfGames] = useState<number>(1); // Default number of games

  const resultsCardsRef = useRef<HTMLDivElement[]>([]); // We will push each ref to this array

  // State to store the value and quantity of the ticket
  const [valorBilhete, setValorBilhete] = useState({
    valor: 2,
    quantidade: 1,
  });

  const modalidadeSettingObj = {
    modalidadesCaixa: modalidadeSetting[0], // Assuming modalidadesCaixa is the first item in the array
    modalidadeSabedoria: modalidadeSetting[1], // Assuming modalidadeSabedoria is the second item
    modalidadePersonalizada: modalidadeSetting[2], // Assuming modalidadePersonalizada is the third item
  };

  const handleModalidadeContent = (settingsObj: IModalidade) => {
    setModalidadeContent(settingsObj);
    console.log(settingsObj);
  };

  const handleNumeroDeJogosSelecionado = (event: any) => {
    const value = event.target.value;
    // Set the clicked number as the selected number
    setSelectedJogos(value);
  };

  const handlePremio = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setPremio(value); // Update the state with the new value
  };

  const handleAcertos = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setAcertos(value); // Update the state with the new value
  };

  const handleApostador = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setApostador(value); // Update the state with the new value
  };

  const handleTipoBilhete = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setTipoBilhete(value); // Update the state with the new value
  };

  const handleNomeConsultor = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setNomeVendedor(value); // Update the state with the new value
  };

  const handleNumeroBilhete = (event: any) => {
    const value = event.target.value; // Get the value from the input
    setNumeroBilhete(value); // Update the state with the new value
  };

  // Function to handle text input changes in the text area
  const handleTextAreaContent = (e: any) => {
    const content = e.target.value;
    setTextAreaValue(content); // Update the text area value in the state

    // If the content is empty, clear the imported numbers
    if (!content.trim()) {
      setImportedNumbersArr([]);
      return;
    }

    const result = content.split(",").map((match: string) => {
      const numbers = match
        .trim() // Remove espaços extras ao redor do grupo
        .split(" ") // Divide os números por espaços
        .filter((num) => num !== "") // Remove valores vazios
        .map(Number) // Converte strings em números
        .sort((a, b) => a - b); // Ordena os números
      return numbers;
    });

    setImportedNumbersArr(result); // Update the state with the imported numbers
  };

  // Function to update the selected option (importar or manual)
  const handleSelectedBilhete = (selected: string) => {
    setAddBilheteSelectedButton(selected);
  };

  // Handle number of games input
  const handleNumberOfGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfGames(Number(e.target.value));
  };

  // Handle game generation based on selected number of games and amount of numbers
  const handleGenerateGames = () => {
    if (!modalidadeContent || modalidadeContent.maxNumber < selectedJogos) {
      console.error("Invalid modalidade settings or numbersPerGame is too high.");
      return; // Prevent further execution if validation fails
    }

    const games: number[][] = [];
    for (let i = 0; i < numberOfGames; i++) {
      const game = generateRandomGame(modalidadeContent.maxNumber, selectedJogos); // Generate a game with the selected number of numbers
      games.push(game);
    }
    setGeneratedGames(games); // Save the generated games in state
  };

  // Function to render the appropriate component (textarea or number selection) based on user selection
  const addBilheteCompToRender = (button: string) => {
    if (button === "importar") {
      // Render a textarea for importing numbers when "importar" is selected
      return (
        <>
          <textarea
            className={styles.textArea}
            placeholder="1 2 3 4, 5 6 7 8, 9 10 11 12..."
            cols={30}
            rows={12}
            value={textAreaValue}
            onChange={handleTextAreaContent}
          ></textarea>

          <div>
            <Title h={3}>Instruções:</Title>
            <li>Para mais de um jogo, coloque uma vírgula entre os jogos.</li>
            <li>Cada número deve estar separado por um espaço.</li>
            <li>Exemplo: 1 2 3 , 4 5 6 7 , 8 9 10 11...</li>
          </div>
        </>
      );
    }

    if (button === "manual") {
      // Render a number selection component when "manual" is selected
      return (
        <>
          <ChooseNumbersComp
            numbersToRender={modalidadeContent?.maxNumber}
            selectionLimit={modalidadeContent?.betNumbers.at(-1)}
            numbersArr={selectedNumbersArr}
            numbersArrSetter={setSelectedNumbersArr}
          />

          {/* Display the generated games */}
          {generatedGames.length > 0 && (
            <div>
              <h3>Jogos Gerados:</h3>
              {generatedGames.map((game, index) => (
                <div key={index}>
                  <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                  <ResultsCard
                    numbersArr={[...game]}
                    acertos={acertos}
                    premio={premio}
                    apostador={apostador}
                    quantidadeDezenas={selectedJogos}
                    resultado={dataResultado}
                    data={currentDate}
                    hora={currentDate}
                    consultor={nomeConsultor}
                    numeroBilhete={numeroBilhete}
                    tipoBilhete={tipoBilhete}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    if (button === "random") {
      return (
        <>
          <div>
            <div className="divider"></div>
            <Title h={2}>{modalidadeContent?.name || ""}</Title>
            <div>
              {modalidadeContent && (
                <div className={styles.inputsRow}>
                  <Title h={3}>Quantidade de Dezenas:</Title>
                  <input
                    className={styles.smallInput}
                    type="number"
                    name=""
                    id=""
                    value={selectedJogos}
                    onChange={handleNumeroDeJogosSelecionado}
                  />
                </div>
              )}
            </div>

            {/* Button to trigger game generation */}
            <div>
              <SimpleButton btnTitle="Gerar Jogos" isSelected={false} func={handleGenerateGames} />
            </div>
            {generatedGames.length > 0 ? (
              <DownloadPDFButton />
            ) : (
              // <SimpleButton
              //   btnTitle="Exportar PDF"
              //   func={() => {
              //     console.log("btn");
              //   }}
              //   isSelected={false}
              // ></SimpleButton>
              ""
            )}

            {/* Display the generated games */}
            {generatedGames.length > 0 && (
              <div>
                <h3>Jogos Gerados:</h3>
                {generatedGames.map((game, index) => (
                  <div key={index}>
                    <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                    <ResultsCard
                      numbersArr={[...game]}
                      acertos={acertos}
                      premio={premio}
                      consultor={nomeConsultor}
                      apostador={apostador}
                      quantidadeDezenas={selectedJogos}
                      resultado={dataResultado}
                      data={currentDate}
                      hora={currentDate}
                      numeroBilhete={numeroBilhete - 1 + 1 + index}
                      tipoBilhete={tipoBilhete}
                    />
                  </div>
                ))}
              </div>
            )}

            {generatedGames.length > 0 && (
              <div>
                <h3>Jogos Gerados:</h3>
                {generatedGames.map((game, index) => (
                  <div key={index}>
                    <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              {modalidadeContent && modalidadeContent?.trevoAmount.length > 1
                ? modalidadeContent?.trevoAmount.map((numero) => {
                    return (
                      <Buttons buttonType="content" key={numero}>
                        {numero}
                      </Buttons>
                    );
                  })
                : ""}
            </div>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    // Fetch data from tempDb instead of the URL
    const fetchData = async () => {
      try {
        const data = await tempDb.modalidades; // Adjust according to how tempDb is used
        setModalidadeSetting(data); // Make sure data is an array
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to generate a random game of unique numbers
  const generateRandomGame = (maxNumber: number, gameSize: number) => {
    const game = new Set<number>(); // Use Set to avoid duplicates
    while (game.size < gameSize) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      game.add(randomNum);
    }
    return Array.from(game).sort((a, b) => a - b); // Convert Set to array and sort
  };

  // SECTION: COMPONENTS RETURN STATEMENT
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
              modalidadeSetting={modalidadeSettingObj}
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
        {/*://SECTION: ticket options */}
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
          </section>
        </section>
        {/* //SECTION: Inputs */}
        {/* Input for consultor name */}
        <div className={styles.inputsRow}>
          <label htmlFor="nomeConsultor">Nome do Consultor:</label>
          <input
            className={styles.smallInput}
            type="text"
            placeholder="Consultor"
            id="nomeConsultor"
            value={nomeConsultor}
            onChange={(e) => {
              handleNomeConsultor(e);
            }}
            min={1} // Minimum number of games is 1
          />
        </div>
        {/* Input for apostador name */}
        <div className={styles.inputsRow}>
          <label htmlFor="apostador">Nome do Apostador:</label>
          <input
            className={styles.smallInput}
            type="text"
            placeholder="Apostador"
            id="apostador"
            value={apostador}
            onChange={(e) => {
              handleApostador(e);
            }}
          />
        </div>
        {/* Input for amount of tickets */}
        <div className={styles.inputsRow}>
          <label htmlFor="numeroBilhete">Número do Bilhete:</label>
          <input
            className={styles.smallInput}
            type="number"
            id="numeroBilhete"
            value={numeroBilhete}
            onChange={(e) => {
              handleNumeroBilhete(e);
            }}
            min={1} // Minimum number of games is 1
          />
        </div>
        {/* Input for number of games */}
        <div className={styles.inputsRow}>
          <label className={styles.inputLabel} htmlFor="numberOfGames">
            Número de jogos:
          </label>
          <input
            className={styles.smallInput}
            type="number"
            id="numberOfGames"
            value={numberOfGames}
            onChange={handleNumberOfGamesChange}
            min={1} // Minimum number of games is 1
          />
        </div>
        {/* Input for número de acertos */}
        <div className={styles.inputsRow}>
          <label htmlFor="acertos">Acertos:</label>
          <input
            className={styles.smallInput}
            type="number"
            id="acertos"
            value={acertos}
            onChange={(e) => {
              handleAcertos(e);
            }}
            min={1} // Minimum number of games is 1
          />
        </div>
        {/* Input for valor do prêmio */}
        <div className={styles.inputsRow}>
          <label htmlFor="premio">Prêmio:</label>
          <input
            className={styles.smallInput}
            type="number"
            id="premio"
            value={premio}
            onChange={(e) => {
              handlePremio(e);
            }}
            min={1} // Minimum number of games is 1
          />
        </div>
        {/* Input for valor do bilhete*/}
        <div className={styles.inputsRow}>
          <label htmlFor="tipoBilhete">Valor Bilhete:</label>
          <input
            className={styles.smallInput}
            type="number"
            id="tipoBilhete"
            value={tipoBilhete}
            onChange={(e) => {
              handleTipoBilhete(e);
            }}
          />
        </div>
        {/* input for data do sorteio */}
        <div className={styles.inputsRow}>
          <label htmlFor="numberOfGames">Data do sorteio:</label>
          <DatePicker
            className={styles.smallInput}
            selected={dataResultado}
            onChange={(dataResultado) => setDataResultado(dataResultado)}
            dateFormat="dd/MM/yyyy" // Optional: Customize date format
          />
        </div>
        {/*//:SECTION: render either the text input or the number selection component */}
        <section className={styles.jogosRow}>
          {/* Import button */}
          <div className={addBilheteSelectedButton === "importar" ? styles.compDiv : ""}>
            {addBilheteCompToRender(addBilheteSelectedButton)}
          </div>
        </section>
        {/* Section to display the total imported games and other details */}
        {addBilheteSelectedButton === "importar" && (
          <div className={styles.checkJogosDiv}>
            <Title h={3}>{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
            <Title h={3}>{`Jogos Importados`}</Title>

            {/* Display each imported game */}
            {importedNumbersArr.length > 0 &&
              importedNumbersArr.map((item: any, index) => {
                return (
                  <div key={index}>
                    {`Jogo ${index + 1} : `}
                    {item.join(", ")}.
                    <ResultsCard
                      numbersArr={[...item]}
                      acertos={acertos}
                      premio={premio}
                      apostador={apostador}
                      quantidadeDezenas={selectedJogos}
                      resultado={dataResultado}
                      data={currentDate}
                      hora={currentDate}
                      numeroBilhete={numeroBilhete}
                      consultor={nomeConsultor}
                      tipoBilhete={tipoBilhete}
                    />
                  </div>
                );
              })}
          </div>
        )}
        {/* Render the selected numbers if any */}
        {selectedNumbersArr}
      </main>
    </>
  );
};

export default NovoBilhete;
