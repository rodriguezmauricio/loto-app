// app/(authenticated)/verificarResultados/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./verificarResultados.module.scss";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
// import { Modal } from "components/modal/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming modalidades are defined in tempDb.ts
import { tempDb } from "../../../tempDb";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    // Add other fields as needed
}

const ResultsPage = () => {
    const router = useRouter();
    const [modalidade, setModalidade] = useState<string>("");
    const [winningNumbers, setWinningNumbers] = useState<string>("");
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);

    const modalidadeSettingObj = {
        modalidadesCaixa: modalidadeSetting[0]?.modalidadesCaixa || [],
        modalidadeSabedoria: modalidadeSetting[1]?.modalidadeSabedoria || [],
        modalidadePersonalizada: modalidadeSetting[2]?.modalidadePersonalizada || [],
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!modalidade) {
            toast.error("Por favor, selecione uma modalidade.");
            return;
        }

        if (!winningNumbers.trim()) {
            toast.error("Por favor, insira os números vencedores.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ modalidade, winningNumbers }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.error)
                        ? data.error.map((err: any) => err.message).join(", ")
                        : data.error
                );
            }

            // Set the winners
            setWinners(data.winners);
            toast.success("Resultado salvo com sucesso!");

            // Optionally, reset the form
            setModalidade("");
            setWinningNumbers("");
        } catch (error: any) {
            console.error("Error saving result:", error);
            toast.error(error.message || "Erro ao salvar resultado.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            try {
                const data = tempDb.modalidades; // Remove 'await' as it's synchronous
                setModalidadeSetting(data); // 'data' is an array of objects
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log("modalidadeSetting: ", modalidadeSetting);
    console.log("modalidadeSettingObj:", modalidadeSettingObj.modalidadesCaixa);

    return (
        <>
            <ToastContainer />
            <PageHeader title="Registrar Resultado" subpage linkTo="/dashboard" />
            <main className="main">
                <section className={styles.formSection}>
                    <h2>Registrar Resultado</h2>
                    <form onSubmit={handleSubmit} className={styles.resultForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="modalidade">Modalidade:</label>
                            <select
                                id="modalidade"
                                value={modalidade}
                                onChange={(e) => setModalidade(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma modalidade</option>
                                {modalidadeSettingObj.modalidadesCaixa.map((mod: any) => (
                                    <option key={mod.name} value={mod.name}>
                                        {mod.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                            />
                        </div>

                        <SimpleButton
                            btnTitle={loading ? "Salvando..." : "Salvar Resultado"}
                            type="submit"
                            disabled={loading}
                            isSelected={false}
                            func={() => {}}
                        />
                    </form>
                </section>

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

export default ResultsPage;
