// app/(authenticated)/ganhadores/page.tsx

"use client";

import { useState, useEffect } from "react";
import styles from "./ganhadores.module.css";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Tabs from "components/tabs/Tabs";
import GanhadoresTable from "components/ganhadoresTable/GanhadoresTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import modalidades from tempDb
import { tempDb } from "../../../tempDb";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
}

const GanhadoresPage = () => {
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);
    const [selectedModalidade, setSelectedModalidade] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Fetch modalidades from tempDb on component mount
    useEffect(() => {
        const fetchModalidades = () => {
            try {
                const data = tempDb.modalidades; // Synchronous fetch
                setModalidadeSetting(data); // 'data' is an array of objects
            } catch (error) {
                console.log("Error fetching modalidades:", error);
            }
        };

        fetchModalidades();
    }, []);

    // Function to aggregate all modalidades into a single array for the dropdown
    const getAllModalidades = () => {
        const modalidades: string[] = [];

        modalidadeSetting.forEach((category) => {
            const key = Object.keys(category)[0];
            const mods = category[key];
            mods.forEach((mod: any) => {
                modalidades.push(mod.name);
            });
        });

        return modalidades;
    };

    // Handle fetching winners based on filters and pagination
    const handleFetchWinners = async () => {
        // Validate that at least one filter is selected
        if (!selectedModalidade && !selectedDate) {
            toast.error("Por favor, selecione pelo menos um filtro.");
            return;
        }

        setLoading(true);
        setWinners([]);

        try {
            // Build query parameters
            const params = new URLSearchParams();

            if (selectedModalidade) {
                params.append("modalidade", selectedModalidade);
            }

            if (selectedDate) {
                // Assuming filtering by the date the sorteio was created
                params.append("startDate", selectedDate);
                params.append("endDate", selectedDate);
            }

            params.append("page", currentPage.toString());
            params.append("limit", "10"); // Adjust as needed

            const response = await fetch(`/api/ganhadores?${params.toString()}`, {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.error)
                        ? data.error.map((err: any) => err.message).join(", ")
                        : data.error
                );
            }

            setWinners(data.winners);
            setTotalPages(data.totalPages || 1);
            toast.success("Ganhadores buscados com sucesso!");
        } catch (error: any) {
            console.error("Error fetching winners:", error);
            toast.error(error.message || "Erro ao buscar ganhadores.");
        } finally {
            setLoading(false);
        }
    };

    // Aggregate all modalidades for dropdown
    const allModalidades = getAllModalidades();

    // Prepare Tabs content based on modalidade categories
    const tabsArray = modalidadeSetting.map((category) => {
        const key = Object.keys(category)[0];
        const mods = category[key];
        return {
            tabTitle: key.replace("modalidade", ""), // e.g., "Caixa", "Sabedoria", "Personalizada"
            tabContent: <GanhadoresTable winners={winners} loading={loading} />,
        };
    });

    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            handleFetchWinners();
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            handleFetchWinners();
        }
    };

    return (
        <>
            <ToastContainer />
            <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
            <main className="main">
                <section>
                    {/* Filter Controls */}
                    <div className={styles.filterRow}>
                        {/* Modalidade Filter */}
                        <div className={styles.filterGroup}>
                            <label htmlFor="modalidade">Modalidade:</label>
                            <select
                                id="modalidade"
                                value={selectedModalidade}
                                onChange={(e) => setSelectedModalidade(e.target.value)}
                            >
                                <option value="">Todas Modalidades</option>
                                {allModalidades.map((mod) => (
                                    <option key={mod} value={mod}>
                                        {mod}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className={styles.filterGroup}>
                            <label htmlFor="sorteioDate">Data do Sorteio:</label>
                            <input
                                type="date"
                                id="sorteioDate"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        {/* Fetch Button */}
                        <div className={styles.filterGroup}>
                            <SimpleButton
                                btnTitle={loading ? "Buscando..." : "Buscar Ganhadores"}
                                type="button"
                                func={handleFetchWinners}
                                disabled={loading}
                                isSelected={false}
                            />
                        </div>

                        {/* Export CSV Button */}
                        <div className={styles.filterGroup}>
                            <SimpleButton
                                btnTitle="Exportar CSV"
                                type="button"
                                func={() => {
                                    if (winners.length === 0) {
                                        toast.error("Nenhum ganhador para exportar.");
                                        return;
                                    }

                                    const headers = [
                                        "ID do Bilhete",
                                        "Números",
                                        "Modalidade",
                                        "ID do Usuário",
                                        "Nome do Usuário",
                                        "Data do Sorteio",
                                        "Prêmio",
                                    ];
                                    const rows = winners.map((bet) => [
                                        bet.id,
                                        bet.numbers.join(", "),
                                        bet.modalidade,
                                        bet.userId,
                                        bet.userName,
                                        bet.sorteioDate,
                                        bet.premio.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }),
                                    ]);

                                    let csvContent =
                                        "data:text/csv;charset=utf-8," +
                                        [headers, ...rows].map((e) => e.join(",")).join("\n");

                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "ganhadores.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                disabled={winners.length === 0}
                                isSelected={false}
                            />
                        </div>
                    </div>

                    {/* Tabs for Modalidade Categories */}
                    <Tabs tabArray={tabsArray} />

                    {/* Pagination Controls */}
                    <div className={styles.pagination}>
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Anterior
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Próxima
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
};

export default GanhadoresPage;
