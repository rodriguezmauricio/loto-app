"use client"; // Marks the component to be rendered on the client side

// Importing required components and CSS styles from the project structure
import Title from "components/title/Title";
import PageHeader from "components/pageHeader/PageHeader";
import TabsWithFilters from "components/tabsWithFilters/TabsWithFilters";
import IconCard from "components/iconCard/IconCard";
import ChooseNumbersComp from "components/chooseNumbersComp/ChooseNumbersComp";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useEffect, useState, useRef } from "react";
import { tempDb } from "tempDb"; // Import tempDb
import ResultsCard from "components/resultsCard/ResultsCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import { useRouter, useParams } from "next/navigation";
import styles from "./novoBilhete.module.scss";

export interface IModalidade {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber: number;
}

interface Wallet {
    id: string;
    balance: number;
    // Add other fields if necessary
}

interface Apostador {
    id: string;
    username: string;
    phone: string;
    pix: string;
    role: string;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string; // ISO date string
    wallet: Wallet | null;
    // Add other fields as necessary
}

const NovoBilhete = () => {
    // VARS: FOR SPECIFIC APOSTADOR
    const router = useRouter();
    const params = useParams();
    const { apostadorId } = params;
    const [apostador, setApostador] = useState<Apostador | null>(null);

    //VARS: GENERATE TICKET
    const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);
    const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();
    const [quantidadeDeDezenas, setQuantidadeDeDezenas] = useState<number>(1); // selected numbers for random games
    const [generatedGames, setGeneratedGames] = useState<number[][]>([]); // games that were generated
    const [generatedGamesDisplay, setGeneratedGamesDisplay] = useState<number[][]>([]); // games that were generated and formatted to display
    const [numberOfGames, setNumberOfGames] = useState<number>(1); // number of games to be generated

    const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]); // selected numbers in the game as strings
    const [importedNumbersArr, setImportedNumbersArr] = useState<string[][]>([]);
    const [importtextAreaValue, setImportTextAreaValue] = useState(""); // content of the text area for imported games

    const [maxTickets, setMaxTickets] = useState<number>(0);

    const [formData, setFormData] = useState<{
        consultantName: string;
        apostadorName: string;
        lote: string;
        ticketNumber: number;
        acertos: number;
        prize: number;
        resultDate: Date | null; // Allow null
        numberOfGames: number;
        currentDate: Date;
        ticketType: string;
        valorBilhete: number; // Added field
    }>({
        consultantName: "Consultor Desconhecido",
        apostadorName: "Apostador Desconhecido",
        lote: "Lote Desconhecido",
        ticketNumber: 0,
        acertos: 0,
        prize: 0,
        resultDate: new Date(),
        numberOfGames: 0,
        currentDate: new Date(),
        ticketType: "Tipo Desconhecido",
        valorBilhete: 1, // Initialize
    });

    const divRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for divs to export to PDF
    const cardRef = useRef<HTMLDivElement | null>(null); // Ref for exporting individually

    // Compute whether there is at least one bet
    const hasBets =
        modalidadeContent?.name &&
        ((importedNumbersArr && importedNumbersArr.length > 0) ||
            (generatedGames && generatedGames.length > 0) ||
            (selectedNumbersArr && selectedNumbersArr.length > 0));

    //HANDLERS:

    //exports image for single tickets in jpg, png or copying to the clipboard
    const exportAsImage = async (format = "png", saveToClipboard = false) => {
        if (cardRef.current === null) return;

        try {
            let dataUrl;
            if (format === "jpeg") {
                dataUrl = await toJpeg(cardRef.current, { quality: 0.95 });
            } else {
                dataUrl = await toPng(cardRef.current);
            }

            // Convert data URL to Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            if (saveToClipboard) {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                } catch (err) {
                    console.error("Failed to copy image to clipboard", err);
                }
            } else {
                const fileName = format === "jpeg" ? "card.jpg" : "card.png";
                saveAs(blob, fileName);
            }
        } catch (err) {
            console.error("Error exporting image", err);
        }
    };

    const modalidadeSettingObj = {
        modalidadesCaixa: modalidadeSetting[0],
        modalidadeSabedoria: modalidadeSetting[1],
        modalidadePersonalizada: modalidadeSetting[2],
    };

    // export all tickets to a single PDF
    const handleExportPDF = async () => {
        let pdf: jsPDF | null = null;

        for (let i = 0; i < divRefs.current.length; i++) {
            const div = divRefs.current[i];
            if (div) {
                const canvas = await html2canvas(div, { scale: window.devicePixelRatio });
                const imgData = canvas.toDataURL("image/png");
                const divWidth = canvas.width;
                const divHeight = canvas.height;

                const pdfWidth = divWidth * 0.264583; // Convert pixels to mm
                const pdfHeight = divHeight * 0.264583;

                if (i === 0) {
                    pdf = new jsPDF({
                        orientation: divWidth > divHeight ? "landscape" : "portrait",
                        unit: "mm",
                        format: [pdfWidth, pdfHeight],
                    });
                } else {
                    pdf?.addPage(
                        [pdfWidth, pdfHeight],
                        divWidth > divHeight ? "landscape" : "portrait"
                    );
                }

                pdf?.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            }
        }

        if (pdf) {
            pdf.save("jogos.pdf");
        }
    };

    const handleModalidadeContent = (settingsObj: IModalidade) => {
        setModalidadeContent(settingsObj);
    };

    const handleQuantidadeDezenasSelecionadas = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value); // Ensure it's a number
        setQuantidadeDeDezenas(value);
    };

    const handleTextAreaContent = (e: any) => {
        const content = e.target.value;
        setImportTextAreaValue(content);

        if (!content.trim()) {
            setImportedNumbersArr([]);
            return;
        }

        const result = content.split("\n").map((match: string) => {
            const numbers = match
                .trim()
                .split(" ")
                .filter((num) => num !== "")
                .map((num) => num.padStart(2, "0")); // Keep as strings with leading zero
            return numbers;
        });

        setImportedNumbersArr(result);
    };

    const handleSelectedBilhete = (selected: string) => {
        setAddBilheteSelectedButton(selected);
    };

    const handleNumberOfGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfGames(Number(e.target.value));
    };

    const handleGenerateGames = () => {
        if (!modalidadeContent || modalidadeContent.maxNumber < quantidadeDeDezenas) {
            console.error("Invalid modalidade settings or numbersPerGame is too high.");
            return; // Prevent further execution if validation fails
        }

        const games: number[][] = [];
        for (let i = 0; i < numberOfGames; i++) {
            const game = generateRandomGame(modalidadeContent.maxNumber, quantidadeDeDezenas);
            games.push(game); // Store the generated game as numbers
        }

        const gamesDisplay: any[][] = [];
        for (let i = 0; i < numberOfGames; i++) {
            const gameDisplay = generateRandomGame(
                modalidadeContent.maxNumber,
                quantidadeDeDezenas
            ).map((num) => num.toString().padStart(2, "0")); // Keep as strings with leading zero
            gamesDisplay.push(gameDisplay); // Store the generated game as numbers
        }

        setGeneratedGames(games); // Update state with number arrays
        setGeneratedGamesDisplay(gamesDisplay);
    };

    const validateForm = () => {
        if (!formData.consultantName.trim()) {
            alert("Por favor, insira o nome do consultor.");
            return false;
        }
        if (!formData.apostadorName.trim()) {
            alert("Por favor, insira o nome do apostador.");
            return false;
        }
        if (isNaN(formData.valorBilhete) || formData.valorBilhete <= 0) {
            alert("Por favor, insira um valor válido para o bilhete.");
            return false;
        }
        if (isNaN(quantidadeDeDezenas) || quantidadeDeDezenas <= 0) {
            alert("Quantidade de dezenas deve ser pelo menos 1.");
            return false;
        }
        // Add other validations as needed
        return true;
    };

    const handleSubmitApostas = async () => {
        if (!validateForm()) return;

        console.log("handle submit active");
        try {
            let games: number[][] = [];

            // Collect games based on the selected method
            if (addBilheteSelectedButton === "importar") {
                games = importedNumbersArr.map((game: string[]) =>
                    game.map((num) => parseInt(num, 10))
                );
            } else if (addBilheteSelectedButton === "random") {
                games = generatedGames; // Already an array of arrays of numbers
            } else if (addBilheteSelectedButton === "manual") {
                if (selectedNumbersArr.length === 0) {
                    console.error("No numbers selected for manual game");
                    alert("Por favor, selecione números para o jogo manual.");
                    return;
                }
                games = [selectedNumbersArr.map((num) => parseInt(num, 10))];
            }

            if (games.length === 0) {
                console.error("No games to submit");
                alert("Nenhum jogo para enviar.");
                return;
            }

            // Validate required form fields
            if (!formData.consultantName.trim()) {
                alert("Por favor, insira o nome do consultor.");
                return;
            }

            if (!formData.apostadorName.trim()) {
                alert("Por favor, insira o nome do apostador.");
                return;
            }

            if (!formData.valorBilhete || formData.valorBilhete <= 0) {
                alert("Por favor, insira um valor válido para o bilhete.");
                return;
            }

            // Ensure resultDate is a Date object
            const resultDate = formData.resultDate || new Date();

            // Calculate total amount
            const totalAmount = formData.valorBilhete * games.length;

            // Validate against balance
            if (
                apostador?.wallet?.balance !== undefined &&
                totalAmount > apostador.wallet.balance
            ) {
                alert("Saldo insuficiente para esta operação.");
                return;
            }

            const apostaData = {
                userId: apostadorId,
                bets: games.map((game, index) => ({
                    numbers: game, // number[]
                    modalidade: modalidadeContent?.name || "Default Modalidade",
                    acertos: Number(formData.acertos) || 0, // Ensure it's a number
                    premio: Number(formData.prize) || 0, // Ensure it's a number
                    consultor: formData.consultantName || "Consultor Desconhecido",
                    apostador: formData.apostadorName || "Apostador Desconhecido",
                    quantidadeDeDezenas: Number(quantidadeDeDezenas) || 0, // Ensure it's a number
                    resultado: formData.resultDate
                        ? formData.resultDate.toISOString()
                        : new Date().toISOString(),
                    data: formData.currentDate.toISOString(),
                    hora: formData.currentDate.toISOString(),
                    lote: formData.lote || "Lote Desconhecido",
                    tipoBilhete: formData.ticketType || "Tipo Desconhecido",
                    valorBilhete: Number(formData.valorBilhete) || 0, // Ensure it's a number
                })),
                totalAmount: Number(formData.valorBilhete) * games.length, // Ensure it's a number
            };

            console.log("Aposta Data to be sent:", JSON.stringify(apostaData, null, 2)); // Log the data

            const response = await fetch("/api/apostas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apostaData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Apostas created successfully:", result);
                alert("Bilhetes criados com sucesso!");

                const updatedApostadorResponse = await fetch(`/api/users/${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (updatedApostadorResponse.ok) {
                    const updatedApostador: Apostador = await updatedApostadorResponse.json();
                    setApostador(updatedApostador);
                    console.log("Updated Apostador data:", updatedApostador);
                }
                // Optionally redirect or display a success message
                router.push(`/apostadores/${apostadorId}`);
            } else {
                const errorData = await response.json();
                console.error("Failed to create apostas:", errorData);
                alert(errorData.error || "Erro ao criar apostas.");
            }
        } catch (error) {
            console.error("Error creating apostas:", error);
            alert("Ocorreu um erro ao criar apostas.");
        }
    };

    //FUNCTIONS:
    const addBilheteCompToRender = (button: string) => {
        const renderExportButtons = () => (
            <div className={styles.buttonRow}>
                <SimpleButton
                    btnTitle="Export as PNG"
                    func={() => exportAsImage("png")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Export as JPEG"
                    func={() => exportAsImage("jpeg")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Copy Image"
                    func={() => exportAsImage("png", true)}
                    isSelected={false}
                />
            </div>
        );

        if (button === "importar") {
            return (
                <>
                    <Title h={2}>{modalidadeContent?.name || ""}</Title>
                    <section className={styles.checkJogosDiv}>
                        <textarea
                            className={styles.textArea}
                            placeholder={`1 2 3 4\n5 6 7 8\n9 10 11 12\n...`}
                            cols={30}
                            rows={12}
                            value={importtextAreaValue}
                            onChange={handleTextAreaContent}
                        ></textarea>
                        <div>
                            <Title h={3}>Instruções:</Title>
                            <li>Para mais de um jogo, coloque uma vírgula entre os jogos.</li>
                            <li>Cada número deve estar separado por um espaço.</li>
                            <li>Exemplo: 1 2 3 , 4 5 6 7 , 8 9 10 11...</li>
                        </div>
                    </section>
                    {importedNumbersArr.length > 0 && (
                        <section className={styles.inputRow}>
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <Title
                                h={3}
                            >{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
                            <Title h={3}>{`Jogos Importados`}</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                        {renderExportButtons()}
                                    </div>
                                </article>
                            ))}
                            <Title h={2}>{`${importedNumbersArr.length} Jogos Gerados`}</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(" ")}
                                </article>
                            ))}
                        </section>
                    )}
                </>
            );
        }

        if (button === "manual") {
            return (
                <>
                    <ChooseNumbersComp
                        numbersToRender={modalidadeContent?.maxNumber}
                        selectionLimit={modalidadeContent?.betNumbers.at(-1)}
                        numbersArr={selectedNumbersArr}
                        numbersArrSetter={setSelectedNumbersArr}
                    />
                    {generatedGames.length > 0 && (
                        <div>
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <h3>Jogos Gerados:</h3>
                            {generatedGamesDisplay.map((item, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                    </div>
                                    {renderExportButtons()}
                                </article>
                            ))}
                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGamesDisplay.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(" ")}
                                </article>
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
                        <Title h={2}>{modalidadeContent?.name || ""}</Title>
                        <div className={styles.inputsRow}>
                            <Title h={3}>Quantidade de Dezenas:</Title>
                            <input
                                className={styles.smallInput}
                                type="number"
                                id="quantidadeDeDezenas"
                                value={quantidadeDeDezenas}
                                onChange={handleQuantidadeDezenasSelecionadas}
                                min={1}
                                max={modalidadeContent?.maxNumber || 0}
                            />
                        </div>
                        <SimpleButton
                            btnTitle="Gerar Jogos"
                            isSelected={false}
                            func={handleGenerateGames}
                            disabled={
                                !modalidadeContent ||
                                !quantidadeDeDezenas ||
                                quantidadeDeDezenas > modalidadeContent.maxNumber
                            } // Disable button if conditions aren't met
                        />
                    </div>
                    {generatedGames.length > 0 && (
                        <div>
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <h3>Jogos Gerados:</h3>
                            {generatedGamesDisplay.map((item, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                    </div>
                                    {renderExportButtons()}
                                </article>
                            ))}

                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGamesDisplay.map((item: any, index) => (
                                <article key={index}>{item.join(" ")}</article>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        return null; // Default return for unsupported options
    };

    // Function to generate a random game of unique numbers
    const generateRandomGame = (maxNumber: number, gameSize: number) => {
        const game = new Set<number>(); // Use Set to avoid duplicates
        while (game.size < gameSize) {
            const randomNum = Math.floor(Math.random() * maxNumber) + 1;
            game.add(randomNum);
        }
        return Array.from(game).sort((a, b) => a - b); // Convert Set to array and sort
    };

    useEffect(() => {
        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar apostador.");
                }

                const data: Apostador = await response.json();
                console.log(data);

                setApostador(data);
            } catch (error) {
                console.error("Error fetching apostador:", error);
                // Handle error appropriately, e.g., show a notification or redirect
            }
        };

        fetchApostador();
    }, [apostadorId]);

    console.log("Apostador Balance", apostador?.wallet?.balance);
    useEffect(() => {
        if (formData.valorBilhete > 0 && apostador?.wallet?.balance) {
            const calculatedMax = Math.floor(apostador.wallet.balance / formData.valorBilhete);
            setMaxTickets(calculatedMax);
            console.log("Calculated maxTickets:", calculatedMax);
        } else {
            setMaxTickets(0);
            console.log("Set maxTickets to 0"); // Debugging line
        }
    }, [formData.valorBilhete, apostador]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await tempDb.modalidades; // Adjust according to how tempDb is used
                setModalidadeSetting(data); // Make sure data is an array
                // if (data.length > 0) {
                //     setModalidadeContent(data[0]); // Set to the first item
                // }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // SECTION: COMPONENTS RETURN STATEMENT
    //RETURN:
    return (
        <>
            <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadorNamees`} />
            <main className="main">
                <section>
                    <div className={styles.sectionContainer}>
                        <Title h={2}>Sorteios</Title>
                        <section className={styles.buttonFilterRow}>
                            <TabsWithFilters
                                modalidadeSetting={modalidadeSettingObj}
                                handleModalidadeContent={handleModalidadeContent}
                            />
                        </section>
                        {/* <section>
                            <IconCard
                                icon="lotto"
                                title="Título do Sorteio"
                                description="Data e Hora do Sorteio"
                                fullWidth
                                isClickable={false}
                            />
                        </section> */}
                    </div>

                    {/* Conditionally render the form only if a modalidade is selected */}
                    {modalidadeContent && (
                        <>
                            <div className={styles.sectionContainer}>
                                <Title h={2}>Bilhetes</Title>
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
                            </div>

                            <div className={styles.maxBilhetesRow}>
                                {`Quantidade Máxima de Bilhetes Disponíveis: ${maxTickets}`}
                            </div>

                            {/* Form Fields */}
                            <div className={styles.sectionContainer}>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="consultantName">Nome do Consultor:</label>
                                        <input
                                            type="text"
                                            id="consultantName"
                                            value={formData.consultantName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    consultantName: e.target.value,
                                                })
                                            }
                                            placeholder="Consultor"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="apostadorName">Nome do Apostador:</label>
                                        <input
                                            type="text"
                                            id="apostadorName"
                                            value={formData.apostadorName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    apostadorName: e.target.value,
                                                })
                                            }
                                            placeholder="Apostador"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="lote">Lote:</label>
                                        <input
                                            type="text"
                                            id="lote"
                                            value={formData.lote}
                                            onChange={(e) =>
                                                setFormData({ ...formData, lote: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="ticketNumber">Número Bilhete:</label>
                                        <input
                                            type="number"
                                            id="ticketNumber"
                                            value={formData.ticketNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ticketNumber: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="acertos">Acertos:</label>
                                        <input
                                            type="number"
                                            id="acertos"
                                            value={formData.acertos}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    acertos: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="prize">Prêmio:</label>
                                        <input
                                            type="number"
                                            id="prize"
                                            value={formData.prize}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    prize: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="valorBilhete">Valor Bilhete:</label>
                                        <input
                                            type="number"
                                            id="valorBilhete"
                                            value={formData.valorBilhete}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    valorBilhete: Number(e.target.value),
                                                })
                                            }
                                            min={0.01}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="resultDate">Data do Sorteio:</label>
                                        <DatePicker
                                            id="resultDate"
                                            selected={formData.resultDate}
                                            onChange={(date: Date | null) =>
                                                setFormData({ ...formData, resultDate: date })
                                            }
                                            dateFormat="dd/MM/yyyy"
                                            className={styles.datePicker} // Apply a new dedicated class
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
                {/* Render jogosRow and fixed button only if modalidadeContent is selected */}
                {modalidadeContent && (
                    <>
                        <section className={styles.jogosRow}>
                            {addBilheteCompToRender(addBilheteSelectedButton)}
                        </section>

                        {/* Fixed "Salvar Apostas" Button */}
                        <SimpleButton
                            btnTitle="Salvar Apostas"
                            func={handleSubmitApostas}
                            isSelected={false}
                            disabled={!hasBets}
                            className={`${styles.submitButton} ${styles.fixedSaveButton}`}
                            title={
                                !hasBets ? "Adicione pelo menos um jogo para salvar apostas" : ""
                            }
                        />
                    </>
                )}

                {/* Optionally, display a prompt to select modalidade if not selected */}
                {!modalidadeContent && (
                    <div className={styles.promptContainer}>
                        <Title h={3}>Por favor, selecione uma modalidade para começar.</Title>
                    </div>
                )}
            </main>
        </>
    );
};

export default NovoBilhete;
