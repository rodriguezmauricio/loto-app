"use client";

import { useState, useEffect } from "react";
import styles from "./ganhadores.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ModalidadeKey, tempDb } from "tempDb";
import GanhadorCard from "components/ganhadorCard/GanhadorCard";

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
}

interface GroupedWinners {
    sorteioDate: string;
    winners: WinnerBet[];
}

// Map user-friendly category names to the keys used in tempDb
const categoryMap = {
    Caixa: "Caixa",
    Surpresinha: "Sabedoria", // Sabedoria in tempDb corresponds to Surpresinha
    Personalizada: "Personalizada",
};

export default function GanhadoresPage() {
    const [category, setCategory] = useState<string>(""); // Caixa, Surpresinha, Personalizada
    const [modalities, setModalities] = useState<string[]>([]); // List of loteria names for selected category
    const [selectedModalities, setSelectedModalities] = useState<string[]>([]); // Selected checkboxes
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const perPage = 10; // Adjust as needed

    // When category changes, load the modalities from tempDb
    useEffect(() => {
        setSelectedModalities([]);
        setWinners([]);
        setCurrentPage(1);
        if (!category) {
            setModalities([]);
            return;
        }

        const catKey = categoryMap[category as keyof typeof categoryMap] as ModalidadeKey;
        const foundCategory = tempDb.modalidades.find((mod: any) => mod[catKey]);

        if (foundCategory && foundCategory[catKey]) {
            // Extract `name` from each modality object
            const loteriasList = foundCategory[catKey].map((lot: any) => lot.name);
            setModalities(loteriasList);
        } else {
            setModalities([]);
        }
    }, [category]);

    // Handle fetching winners
    const handleFetchWinners = async () => {
        if (!category) {
            toast.error("Selecione uma categoria (Caixa, Surpresinha ou Personalizada).");
            return;
        }

        if (selectedModalities.length === 0) {
            toast.error("Selecione ao menos uma modalidade.");
            return;
        }

        setLoading(true);
        setWinners([]);
        setCurrentPage(1);

        // Determine the modalidade param (Caixa, Sabedoria, Personalizada)
        const modalidadeParam = categoryMap[category as keyof typeof categoryMap];

        // Determine date filters
        let finalStartDate = startDate ? startDate.toISOString().split("T")[0] : undefined;
        let finalEndDate = endDate ? endDate.toISOString().split("T")[0] : undefined;

        // If only start date is provided and no end date, end date = current date
        if (finalStartDate && !finalEndDate) {
            finalEndDate = new Date().toISOString().split("T")[0];
        }

        try {
            const allResults: WinnerBet[] = [];

            // Fetch winners for each selected modality (loteria)
            // We'll run them in parallel for performance
            const fetchPromises = selectedModalities.map(async (loteria) => {
                const params = new URLSearchParams();
                // Swapped modalidadeParam and loteria to fetch correctly the data DO NOT CHANGE THAT!
                params.append("modalidade", loteria);
                params.append("loteria", modalidadeParam);
                if (finalStartDate) params.append("startDate", finalStartDate);
                if (finalEndDate) params.append("endDate", finalEndDate);

                const response = await fetch(`/api/ganhadores?${params.toString()}`, {
                    method: "GET",
                });
                const data = await response.json();

                if (!response.ok) {
                    // If one fails, continue with others
                    console.error(
                        `Error fetching winners for ${loteria}:`,
                        data.error || response.statusText
                    );
                    return [];
                }

                return data.winners || [];
            });

            const resultsArrays = await Promise.all(fetchPromises);
            for (const arr of resultsArrays) {
                allResults.push(...arr);
            }

            // Now we have all winners combined
            // Group by date, then sort by loteria alphabetically
            // Actually, we need them displayed separated by date and displayed alphabetically by lottery.
            // Let's first sort by date and loteria:
            // Step 1: We'll group by date after sorting by loteria.
            // We'll do a stable sorting approach:
            allResults.sort((a, b) => {
                // Sort by sorteioDate ascending
                if (a.sorteioDate < b.sorteioDate) return -1;
                if (a.sorteioDate > b.sorteioDate) return 1;
                // If same date, sort by loteria alphabetically
                return a.loteria.localeCompare(b.loteria);
            });

            setWinners(allResults);

            if (allResults.length > 0) {
                toast.success("Ganhadores buscados com sucesso!");
            } else {
                toast.info("Nenhum ganhador encontrado.");
            }
        } catch (error: any) {
            console.error("Error fetching winners:", error);
            toast.error(error.message || "Erro ao buscar ganhadores.");
        } finally {
            setLoading(false);
        }
    };

    const groupedWinners = groupWinnersByDate(winners);

    // Pagination logic
    // Flatten groupedWinners into a single array for pagination or handle pagination per group?
    // We'll paginate after grouping. Each groupWinnersByDate element has multiple winners.
    // We'll treat them as a flat list with headers. For simplicity, let's show pagination over the entire flat list.
    // Another approach: show all groups on a single page. The user wants pagination, so let's flatten for pagination.

    const flattenedWinners = flattenGroupedWinners(groupedWinners);

    const totalPages = Math.ceil(flattenedWinners.length / perPage);
    const paginatedWinners = flattenedWinners.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    return (
        <>
            <ToastContainer />
            <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
            <main className="main">
                <section>
                    <div className={styles.filterRow}>
                        {/* Category selection buttons */}
                        <div className={styles.filterGroup}>
                            <label>Categorias:</label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setCategory("Caixa")}
                                    className={category === "Caixa" ? styles.selectedCategory : ""}
                                >
                                    Caixa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCategory("Surpresinha")}
                                    className={
                                        category === "Surpresinha" ? styles.selectedCategory : ""
                                    }
                                >
                                    Surpresinha
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCategory("Personalizada")}
                                    className={
                                        category === "Personalizada" ? styles.selectedCategory : ""
                                    }
                                >
                                    Personalizada
                                </button>
                            </div>
                        </div>

                        {/* Modality checkboxes */}
                        {category && modalities.length > 0 && (
                            <div className={styles.filterGroup}>
                                <label>Modalidades:</label>
                                <div className={styles.checkboxesContainer}>
                                    {modalities.map((mod) => (
                                        <label key={mod} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedModalities.includes(mod)}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        mod,
                                                        selectedModalities,
                                                        setSelectedModalities
                                                    )
                                                }
                                            />
                                            {mod}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Date filters */}
                        <div className={styles.filterGroup}>
                            <label>Data Inicial:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Data inicial"
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Data Final:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Data final"
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <SimpleButton
                                btnTitle={loading ? "Buscando..." : "Buscar Ganhadores"}
                                type="button"
                                func={handleFetchWinners}
                                disabled={loading}
                                isSelected={false}
                            />
                        </div>
                    </div>

                    <div className={styles.resultsSection}>
                        {paginatedWinners.length > 0 ? (
                            paginatedWinners.map((item, idx) =>
                                item.type === "date" ? (
                                    <h3
                                        key={`date-${item.date}-${idx}`}
                                        style={{ marginTop: "20px" }}
                                    >
                                        Data do Sorteio: {item.date}
                                    </h3>
                                ) : (
                                    <GanhadorCard
                                        key={item.winner.id}
                                        username={item.winner.userName}
                                        numbers={item.winner.numbers}
                                        prize={item.winner.premio.toFixed(2)}
                                    />
                                )
                            )
                        ) : (
                            <p>Nenhum ganhador encontrado.</p>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                <span>
                                    Página {currentPage} de {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

// Handle checkbox changes
function handleCheckboxChange(
    modality: string,
    selectedModalities: string[],
    setSelectedModalities: (val: string[]) => void
) {
    if (selectedModalities.includes(modality)) {
        setSelectedModalities(selectedModalities.filter((m) => m !== modality));
    } else {
        setSelectedModalities([...selectedModalities, modality]);
    }
}

// Group winners by date
function groupWinnersByDate(winners: WinnerBet[]): GroupedWinners[] {
    const grouped: { [key: string]: WinnerBet[] } = {};
    for (const w of winners) {
        if (!grouped[w.sorteioDate]) {
            grouped[w.sorteioDate] = [];
        }
        grouped[w.sorteioDate].push(w);
    }
    return Object.keys(grouped).map((date) => ({
        sorteioDate: date,
        winners: grouped[date],
    }));
}

// Flatten grouped winners into a format for pagination
// We'll create a structure like: [{type:"date", date:"2024-01-01"}, {type:"winner", winner:WinnerBet}, ...]
function flattenGroupedWinners(groups: GroupedWinners[]) {
    const result: Array<{ type: "date"; date: string } | { type: "winner"; winner: WinnerBet }> =
        [];
    for (const g of groups) {
        result.push({ type: "date", date: g.sorteioDate });
        for (const w of g.winners) {
            result.push({ type: "winner", winner: w });
        }
    }
    return result;
}
