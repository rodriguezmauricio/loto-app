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

// Define interfaces
interface Loteria {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber?: number; // Optional
}

type ModalidadeCategory = Record<string, Loteria[]>;

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    // Add other fields as needed
}

interface ModalidadeArrayItem {
    modalidadesCaixa?: Loteria[];
    modalidadeSabedoria?: Loteria[];
    modalidadePersonalizada?: Loteria[];
}

const CadastrarResultadosPage = () => {
    const router = useRouter();
    const [modalidadeCategories, setModalidadeCategories] = useState<ModalidadeCategory>({});
    const [selectedModalidadeCategory, setSelectedModalidadeCategory] = useState<string>("");
    const [loterias, setLoterias] = useState<Loteria[]>([]);
    const [selectedLoteria, setSelectedLoteria] = useState<string>("");
    const [winningNumbers, setWinningNumbers] = useState<string>("");
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch modalidades from tempDb on component mount
    useEffect(() => {
        const fetchModalidades = () => {
            try {
                const data = tempDb.modalidades as ModalidadeArrayItem[];

                const modalidades: ModalidadeCategory = data.reduce((acc, curr) => {
                    const [key, value] = Object.entries(curr)[0];
                    acc[key] = value;
                    return acc;
                }, {} as ModalidadeCategory);

                setModalidadeCategories(modalidades);
            } catch (error) {
                console.error("Error fetching modalidades:", error);
                toast.error("Erro ao carregar modalidades.");
            }
        };

        fetchModalidades();
    }, []);

    // Update loterias when selectedModalidadeCategory changes
    useEffect(() => {
        if (selectedModalidadeCategory) {
            const loteriasList = modalidadeCategories[selectedModalidadeCategory] || [];
            setLoterias(loteriasList);
            setSelectedLoteria(""); // Reset selected loteria
        } else {
            setLoterias([]);
            setSelectedLoteria("");
        }
    }, [selectedModalidadeCategory, modalidadeCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!selectedModalidadeCategory) {
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

        // Parse winning numbers into an array of integers
        const numbersArray = winningNumbers
            .trim()
            .split(/\s+/)
            .map((num: string) => parseInt(num, 10))
            .filter((num: number) => !isNaN(num));

        if (numbersArray.length === 0) {
            toast.error("Por favor, insira pelo menos um número vencedor.");
            return;
        }

        // Validate that all winning numbers are valid integers
        const isValid = numbersArray.every((num) => Number.isInteger(num) && num > 0);
        if (!isValid) {
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
                    modalidade: selectedModalidadeCategory, // string
                    loteria: selectedLoteria, // string
                    winningNumbers: numbersArray, // array of numbers
                }),
            });

            const data = await response.json();

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
            setSelectedModalidadeCategory("");
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
                    <h2>Cadastrar Resultado</h2>
                    <form onSubmit={handleSubmit} className={styles.resultForm}>
                        {/* Modalidade Category Selection */}
                        <div className={styles.formGroup}>
                            <label htmlFor="modalidadeCategory">Modalidade:</label>
                            <select
                                id="modalidadeCategory"
                                value={selectedModalidadeCategory}
                                onChange={(e) => setSelectedModalidadeCategory(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma modalidade</option>
                                {Object.keys(modalidadeCategories).map((category) => (
                                    <option key={category} value={category}>
                                        {/* Optional: Map category keys to user-friendly names */}
                                        {category
                                            .replace("modalidades", "")
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Loteria Selection */}
                        <div className={styles.formGroup}>
                            <label htmlFor="loteria">Loteria:</label>
                            <select
                                id="loteria"
                                value={selectedLoteria}
                                onChange={(e) => setSelectedLoteria(e.target.value)}
                                required
                                disabled={!selectedModalidadeCategory}
                            >
                                <option value="">
                                    {selectedModalidadeCategory
                                        ? "Selecione uma loteria"
                                        : "Selecione a modalidade primeiro"}
                                </option>
                                {loterias.map((loteria) => (
                                    <option key={loteria.name} value={loteria.name}>
                                        {loteria.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Winning Numbers Input */}
                        <div className={styles.formGroup}>
                            <label htmlFor="winningNumbers">
                                Números Vencedores (separados por espaço):
                            </label>
                            <textarea
                                id="winningNumbers"
                                value={winningNumbers}
                                onChange={(e) => setWinningNumbers(e.target.value)}
                                placeholder="Ex: 5 12 23 34 45"
                                required
                                rows={3}
                                cols={30}
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
