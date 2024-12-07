"use client";

import styles from "./verificarJogos.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import TabsWithFilters from "components/tabsWithFilters/TabsWithFilters";
import Title from "components/title/Title";
import React, { useEffect, useState } from "react";
import { tempDb } from "tempDb"; // Import tempDb

import { IModalidade } from "../apostadores/[apostadorId]/novoBilhete/page";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";

function VerificarJogos() {
    //VARS:
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);

    const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();

    // State to store imported numbers from text input
    const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]);

    const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);

    // State to store the current text value in the text area
    const [winningGame, setWinningGame] = useState("");
    const [winningGameDisplay, setWinningGameDisplay] = useState(false);
    const [gamesToVerify, setGamesToVerify] = useState("");

    const modalidadeSettingObj = {
        Caixa: modalidadeSetting[0], // Assuming Caixa is the first item in the array
        Sabedoria: modalidadeSetting[1], // Assuming Sabedoria is the second item
        Personalizada: modalidadeSetting[2], // Assuming Personalizada is the third item
    };

    //HANDLERS:
    const handleModalidadeContent = (settingsObj: IModalidade) => {
        setModalidadeContent(settingsObj);
        console.log(settingsObj);
    };

    // Function to handle text input changes in the text area
    const handleWinningGameText = (e: any) => {
        const content = e.target.value;
        setWinningGame(content); // Update the text area value in the state
    };

    // Function to handle text input changes in the text area
    const handleGamesToVerify = (e: any) => {
        const content = e.target.value;
        setGamesToVerify(content); // Update the text area value in the state
    };

    const handleVerifyGamesButton = () => {
        // Parse the winning numbers from the first text area
        const winningNumbersArr = winningGame
            .split(" ")
            .map((num) => parseInt(num))
            .filter((num) => !isNaN(num));

        // Parse the games to verify from the second text area
        const gamesArr = convertGamesTextToArrays(gamesToVerify);

        // Check if any line in the second text area has a different number of numbers compared to the first text area
        const allGamesHaveSameLength = gamesArr.every(
            (game) => game.length === winningNumbersArr.length
        );

        // If there are different lengths, notify the user and stop
        if (!allGamesHaveSameLength) {
            alert(
                "The number of numbers in the winning numbers must match the number of numbers in each line of games to verify."
            );
            return;
        }

        // Proceed to find winners
        const winners = findWinners(gamesArr, winningNumbersArr);

        // Display the result on the screen
        if (winners.length > 0) {
            setWinningGame(winners.join("\n"));
            setWinningGameDisplay(true);
        } else {
            setWinningGame("Não teve nenhum jogo vencedor.");
        }
    };

    //FUNCTIONS:

    const convertGamesTextToArrays = (text: string) => {
        const lines = text.split("\n");
        const gamesArr = lines.map((line) =>
            line
                .split(" ")
                .map((num) => parseInt(num.trim()))
                .filter((num) => !isNaN(num))
        );
        return gamesArr;
    };

    const findWinners = (arrayDeJogos: number[][], resultado: number[]) => {
        const winningGames = [];

        // Loop through each game in arrayDeJogos
        for (let i = 0; i < arrayDeJogos.length; i++) {
            const jogo = arrayDeJogos[i];

            // Check if all numbers in resultado exist in the current game (jogo)
            const isWinner = resultado.every((num) => jogo.includes(num));

            // If the current game is a winner, add the game to the result array
            if (isWinner) {
                winningGames.push(`Game ${i + 1} is a winner: [${jogo.join(", ")}]`);
            }
        }

        // Return all winning games (if any)
        return winningGames;
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

    console.log(importedNumbersArr);

    return (
        <>
            <PageHeader title="Verificar Jogos" subpage={false} linkTo={``} />
            <main className="main">
                <section>
                    <Title h={2}>Modalidade</Title>
                    <section className={styles.buttonFilterRow}>
                        <TabsWithFilters
                            modalidadeSetting={modalidadeSettingObj}
                            handleModalidadeContent={handleModalidadeContent}
                        />
                    </section>
                </section>

                <section>
                    <Title h={3}>Adicione os números vencedores</Title>
                    <textarea
                        className={styles.textInput}
                        placeholder="1 2 3 4 5 ..."
                        cols={30}
                        rows={12}
                        value={winningGame}
                        onChange={handleWinningGameText}
                    ></textarea>

                    <Title h={3}>Adicione os números para conferir</Title>
                    <textarea
                        className={styles.textInput}
                        placeholder={`1 2 3 4\n5 6 7 8\n9 10 11 12`}
                        cols={30}
                        rows={12}
                        value={gamesToVerify}
                        onChange={handleGamesToVerify}
                    ></textarea>
                </section>

                {/* //TODO: TEMPORARY RETURN */}
                <div className={styles.checkJogosDiv}>
                    {/* Display each imported game */}
                    {importedNumbersArr.length > 0 &&
                        importedNumbersArr.map((item: any, index) => {
                            return (
                                <div key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(", ")}.
                                </div>
                            );
                        })}
                    {/* Render the selected numbers if any */}
                    {selectedNumbersArr}
                </div>

                {winningGameDisplay && (
                    <>
                        <Title h={3}>Jogo vencedor</Title>
                        <div>{winningGame}</div>
                    </>
                )}

                <SimpleButton
                    btnTitle="Verificar Jogos"
                    func={handleVerifyGamesButton}
                    isSelected={false}
                />
            </main>
        </>
    );
}

export default VerificarJogos;
