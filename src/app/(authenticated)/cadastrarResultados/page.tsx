// src/app/(authenticated)/cadastrarResultados/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./cadastrarResultados.module.scss";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import modalidades data
import { tempDb } from "../../../tempDb";
import Title from "components/title/Title";

// Define interfaces
interface Loteria {
    name: string;
}

interface Modalidade {
    name: string;
    loterias: Loteria[];
}

interface ResultResponse {
    winners: WinnerBet[];
}

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    // Add other fields as needed
}

const CadastrarResultadosPage = () => {
    const router = useRouter();
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [selectedModalidade, setSelectedModalidade] = useState<string>("");
    const [loterias, setLoterias] = useState<Loteria[]>([]);
    const [selectedLoteria, setSelectedLoteria] = useState<string>("");
    const [winningNumbers, setWinningNumbers] = useState<string>("");
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch modalidades from tempDb on component mount
    useEffect(() => {
        const fetchModalidades = () => {
            try {
                const data = tempDb.modalidades as Modalidade[];
                setModalidades(data);
            } catch (error) {
                console.error("Error fetching modalidades:", error);
            }
        };

        fetchModalidades();
    }, []);

    // Update loterias when selectedModalidade changes
    useEffect(() => {
        if (selectedModalidade) {
            const modalidade = modalidades.find((mod) => mod.name === selectedModalidade);
            if (modalidade) {
                setLoterias(modalidade.loterias);
                setSelectedLoteria(""); // Reset selected loteria
            }
        } else {
            setLoterias([]);
            setSelectedLoteria("");
        }
    }, [selectedModalidade, modalidades]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!selectedModalidade) {
            toast.error("Por favor, selecione uma modalidade.");
            return;
        }

        if (!selectedLoteria) {
            toast.error("Por favor, selecione uma loteria.");
            return;
        }

        if (!winningNumbers.trim()) {
            toast.error("Por favor, insira os números vencedores.");
            return;
        }

        // Validate winning numbers format (e.g., numbers separated by space)
        const numbersArray = winningNumbers.trim().split(/\s+/).map(Number);
        if (numbersArray.some(isNaN)) {
            toast.error("Por favor, insira apenas números válidos, separados por espaço.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    modalidade: selectedModalidade,
                    loteria: selectedLoteria,
                    winningNumbers: numbersArray,
                }),
            });

            const data: ResultResponse = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.error)
                        ? data.error.map((err: any) => err.message).join(", ")
                        : data.error || "Erro ao salvar resultado."
                );
            }

            // Set the winners
            setWinners(data.winners);
            toast.success("Resultado salvo com sucesso!");

            // Optionally, reset the form
            setSelectedModalidade("");
            setSelectedLoteria("");
            setWinningNumbers("");
        } catch (error: any) {
            console.error("Error saving result:", error);
            toast.error(error.message || "Erro ao salvar resultado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <PageHeader title="Cadastrar Resultado" subpage linkTo="/dashboard" />
            <main className="main">
                <section className={styles.formSection}>
                    <Title h={2}>Cadastrar Resultado</Title>
                    <form
                        onSubmit={handleSubmit}
                        className={`${styles.resultForm} ${styles.hcolor}`}
                    >
                        {/* Modalidade Selection */}
                        <div className={styles.formGroup}>
                            <label htmlFor="modalidade">
                                <span className={styles.hcolor}>Modalidade:</span>
                            </label>
                            <select
                                id="modalidade"
                                value={selectedModalidade}
                                onChange={(e) => setSelectedModalidade(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma modalidade</option>
                                {modalidades.map((mod) => (
                                    <option key={mod.name} value={mod.name}>
                                        {mod.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Loteria Selection */}
                        <div className={styles.formGroup}>
                            <label htmlFor="loteria">
                                <span className={styles.hcolor}>Loteria:</span>
                            </label>
                            <select
                                id="loteria"
                                value={selectedLoteria}
                                onChange={(e) => setSelectedLoteria(e.target.value)}
                                required
                                disabled={!selectedModalidade}
                            >
                                <option value="">
                                    {selectedModalidade
                                        ? "Selecione uma loteria"
                                        : "Selecione a modalidade primeiro"}
                                </option>
                                {loterias.map((lot) => (
                                    <option key={lot.name} value={lot.name}>
                                        {lot.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Winning Numbers Input */}
                        <div className={styles.formGroup}>
                            <label htmlFor="winningNumbers">
                                <span className={styles.hcolor}>
                                    Números Vencedores (separados por espaço):
                                </span>
                            </label>
                            <textarea
                                className={styles.textArea}
                                id="winningNumbers"
                                value={winningNumbers}
                                onChange={(e) => setWinningNumbers(e.target.value)}
                                placeholder="Ex: 5 12 23 34 45"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <SimpleButton
                            btnTitle={loading ? "Salvando..." : "Salvar Resultado"}
                            type="submit"
                            disabled={loading}
                            isSelected={true}
                            func={() => {}}
                        />
                    </form>
                </section>

                {/* Display Winners if any */}
                {winners.length > 0 && (
                    <section className={styles.winnersSection}>
                        <h2>Vencedores</h2>
                        <div className={styles.winnersList}>
                            {winners.map((bet) => (
                                <div key={bet.id} className={styles.winnerCard}>
                                    <p>
                                        <strong>ID do Bilhete:</strong> {bet.id}
                                    </p>
                                    <p>
                                        <strong>Números:</strong> {bet.numbers.join(", ")}
                                    </p>
                                    <p>
                                        <strong>Modalidade:</strong> {bet.modalidade}
                                    </p>
                                    <p>
                                        <strong>Loteria:</strong> {bet.loteria}
                                    </p>
                                    <p>
                                        <strong>Usuário ID:</strong> {bet.userId}
                                    </p>
                                    {/* Add more details as needed */}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export default CadastrarResultadosPage;
