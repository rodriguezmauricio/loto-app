"use client";

import { useState, useEffect } from "react";
import styles from "./ganhadores.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    tempDb,
    ModalidadeKey,
    Modalidade,
    ModalidadeCaixa,
    ModalidadeSabedoria,
    ModalidadePersonalizada,
} from "../../../tempDb";
import GanhadorCard from "components/ganhadorCard/GanhadorCard";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import LoadingSpinner from "components/loadingSpinner/LoadingSpinner";

/**
 * The shape of the data we receive from /api/ganhadores
 */
interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    // Both are ISO strings from the server
    sorteioDate: string;
    premio: number;
    betPlacedDate: string;
}

interface GroupedWinners {
    sorteioDate: string; // the string from server
    winners: WinnerBet[];
}

type FlattenedItem = { type: "date"; date: string } | { type: "winner"; winner: WinnerBet };

const categoryMap: { [key: string]: ModalidadeKey } = {
    Caixa: "Caixa",
    Surpresinha: "Sabedoria",
    Personalizada: "Personalizada",
};

export default function GanhadoresPage() {
    const [category, setCategory] = useState("");
    const [modalities, setModalities] = useState<string[]>([]);
    const [selectedModalities, setSelectedModalities] = useState(["Todos"]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    // Optional search fields
    const [searchName, setSearchName] = useState("");
    const [searchLoteria, setSearchLoteria] = useState("");

    // When category changes, re-init state
    useEffect(() => {
        setSelectedModalities(["Todos"]);
        setWinners([]);
        setCurrentPage(1);

        if (!category) {
            setModalities([]);
            return;
        }

        // Map category to the relevant section in tempDb
        const catKey = categoryMap[category as keyof typeof categoryMap];
        const foundCategory = tempDb.modalidades.find((mod: Modalidade) => mod[catKey]);

        if (foundCategory) {
            if (catKey === "Caixa" && "Caixa" in foundCategory) {
                const caixas = foundCategory.Caixa as ModalidadeCaixa[];
                setModalities(caixas.map((lot) => lot.name));
            } else if (catKey === "Sabedoria" && "Sabedoria" in foundCategory) {
                const sabedorias = foundCategory.Sabedoria as ModalidadeSabedoria[];
                setModalities(sabedorias.map((lot) => lot.name));
            } else if (catKey === "Personalizada" && "Personalizada" in foundCategory) {
                const personalizadas = foundCategory.Personalizada as ModalidadePersonalizada[];
                setModalities(personalizadas.map((lot) => lot.name));
            } else {
                setModalities([]);
            }
        } else {
            setModalities([]);
        }
    }, [category]);

    /**
     * Handle API fetch for winners
     */
    const handleFetchWinners = async () => {
        if (!category) {
            toast.error("Selecione uma categoria (Caixa, Surpresinha ou Personalizada).");
            return;
        }

        const modalitiesToFetch = selectedModalities.includes("Todos")
            ? modalities
            : selectedModalities.filter((m) => m !== "Todos");

        if (modalitiesToFetch.length === 0 && !selectedModalities.includes("Todos")) {
            toast.error("Selecione ao menos uma modalidade ou 'Todos'.");
            return;
        }

        setLoading(true);
        setWinners([]);
        setCurrentPage(1);

        const modalidadeParam = categoryMap[category as keyof typeof categoryMap];

        let finalStart = startDate ? startDate.toISOString().split("T")[0] : undefined;
        let finalEnd = endDate ? endDate.toISOString().split("T")[0] : undefined;
        if (finalStart && !finalEnd) {
            finalEnd = new Date().toISOString().split("T")[0];
        }

        try {
            const allResults: WinnerBet[] = [];

            // For each sub-modality
            const fetchPromises = modalitiesToFetch.map(async (modName) => {
                const params = new URLSearchParams();
                params.append("modalidade", modName);
                params.append("loteria", modalidadeParam);
                if (finalStart) params.append("startDate", finalStart);
                if (finalEnd) params.append("endDate", finalEnd);

                if (searchName.trim()) {
                    // If your route accepted userName, you'd append this
                    params.append("userName", searchName.trim());
                }
                if (searchLoteria.trim()) {
                    // If your route accepted loteria filter, you'd do it,
                    // but note we already pass "loteria" = modalidadeParam above.
                    // This is just an example
                    params.append("loteriaFilter", searchLoteria.trim());
                }

                const response = await fetch(`/api/ganhadores?${params.toString()}`, {
                    method: "GET",
                });
                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        `Error fetching winners for ${modName}:`,
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

            // Sort by date descending, then modalidade ascending
            allResults.sort((a, b) => {
                const dateA = new Date(a.sorteioDate);
                const dateB = new Date(b.sorteioDate);
                if (dateB.getTime() < dateA.getTime()) return -1;
                if (dateB.getTime() > dateA.getTime()) return 1;
                return a.modalidade.localeCompare(b.modalidade);
            });

            setWinners(allResults);
            if (allResults.length > 0) toast.success("Ganhadores buscados com sucesso!");
            else toast.info("Nenhum ganhador encontrado.");
        } catch (err: any) {
            console.error("Error fetching winners:", err);
            toast.error(err.message || "Erro ao buscar ganhadores.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Download PDF
     */
    const handleDownloadPDF = () => {
        if (winners.length === 0) {
            toast.error("Nenhum ganhador para baixar.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Lista de Ganhadores", 14, 22);

        const tableColumn = ["Nome", "Loteria", "Modalidade", "Números", "Prêmio", "Data Sorteio"];
        const tableRows: any[] = [];

        winners.forEach((winner) => {
            const rowData = [
                winner.userName,
                winner.loteria,
                winner.modalidade,
                winner.numbers.join(", "),
                `R$ ${winner.premio.toFixed(2)}`,
                new Date(winner.sorteioDate).toLocaleDateString("pt-BR"),
            ];
            tableRows.push(rowData);
        });

        if (typeof doc.autoTable === "function") {
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 30,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [59, 130, 246] },
            });
            doc.save("ganhadores.pdf");
            toast.success("PDF baixado com sucesso!");
        } else {
            toast.error("Erro ao gerar o PDF (autoTable ausente).");
        }
    };

    // Group winners
    const groupedWinners = groupWinnersByDate(winners);
    // Sort descending by date
    groupedWinners.sort((a, b) => {
        const da = new Date(a.sorteioDate).getTime();
        const db = new Date(b.sorteioDate).getTime();
        return db - da;
    });

    const flattened = flattenGroupedWinners(groupedWinners);

    // Pagination
    const totalPages = Math.ceil(flattened.length / perPage);
    const paginatedWinners = flattened.slice((currentPage - 1) * perPage, currentPage * perPage);

    const renderedContent = buildRenderedContent(paginatedWinners);

    return (
        <>
            <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
            <ToastContainer />
            <main className={styles.main}>
                <section>
                    <div className={styles.filterRow}>
                        {/* Category Buttons */}
                        <div className={styles.categoriesGroup}>
                            <label className={styles.label}>Categorias:</label>
                            <div className={styles.categoryButtons}>
                                {["Caixa", "Surpresinha", "Personalizada"].map((cat) => (
                                    <SimpleButton
                                        key={cat}
                                        btnTitle={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`${styles.categoryButton} ${
                                            category === cat ? styles.selectedCategory : ""
                                        }`}
                                        func={() => setCategory(cat)}
                                        isSelected={category === cat}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modalidades */}
                        {category && (
                            <div className={styles.modalidadesGroup}>
                                <label className={styles.label}>Modalidades:</label>
                                <div className={styles.modalidadesOptions}>
                                    {/* "Todos" */}
                                    <label
                                        className={`${styles.modalidadeOption} ${
                                            selectedModalities.includes("Todos")
                                                ? styles.selectedModalidade
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedModalities.includes("Todos")}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    "Todos",
                                                    selectedModalities,
                                                    setSelectedModalities
                                                )
                                            }
                                            className={styles.checkbox}
                                        />
                                        <span>Todos</span>
                                    </label>

                                    {modalities.map((mod) => (
                                        <label
                                            key={mod}
                                            className={`${styles.modalidadeOption} ${
                                                selectedModalities.includes(mod) &&
                                                !selectedModalities.includes("Todos")
                                                    ? styles.selectedModalidade
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedModalities.includes(mod) &&
                                                    !selectedModalities.includes("Todos")
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        mod,
                                                        selectedModalities,
                                                        setSelectedModalities
                                                    )
                                                }
                                                className={styles.checkbox}
                                            />
                                            <span>{mod}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search fields */}
                        <div className={styles.searchFilters}>
                            <div className={styles.searchGroup}>
                                <label className={styles.label}>Buscar por Nome:</label>
                                <input
                                    type="text"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    placeholder="Nome do ganhador"
                                    className={styles.searchInput}
                                />
                            </div>

                            <div className={styles.searchGroup}>
                                <label className={styles.label}>Buscar por Loteria:</label>
                                <input
                                    type="text"
                                    value={searchLoteria}
                                    onChange={(e) => setSearchLoteria(e.target.value)}
                                    placeholder="Nome da loteria"
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>

                        {/* Date pickers */}
                        <div className={styles.dateFilters}>
                            <div className={styles.dateGroup}>
                                <label className={styles.label}>Data Inicial:</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    locale="pt-BR"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Data inicial"
                                    maxDate={endDate || new Date()}
                                    className={styles.datePicker}
                                />
                            </div>

                            <div className={styles.dateGroup}>
                                <label className={styles.label}>Data Final:</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    locale="pt-BR"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Data final"
                                    minDate={startDate || undefined}
                                    maxDate={new Date()}
                                    className={styles.datePicker}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttonsRow}>
                        <div className={styles.fetchButtonGroup}>
                            <SimpleButton
                                btnTitle={loading ? "Buscando..." : "Buscar Ganhadores"}
                                type="button"
                                func={handleFetchWinners}
                                disabled={loading}
                                className={`${styles.fetchButton} ${
                                    loading ? styles.disabledButton : ""
                                }`}
                                isSelected={false}
                            />
                        </div>

                        <div className={styles.downloadButtonGroup}>
                            <SimpleButton
                                btnTitle="Baixar PDF"
                                type="button"
                                func={handleDownloadPDF}
                                disabled={winners.length === 0}
                                className={`${styles.downloadButton} ${
                                    winners.length === 0 ? styles.disabledButton : ""
                                }`}
                                isSelected={false}
                            />
                        </div>
                    </div>

                    {/* Winners Section */}
                    <div className={styles.winnersSection}>
                        {loading ? (
                            <LoadingSpinner />
                        ) : winners.length > 0 ? (
                            <>
                                <div className={styles.grid}>{renderedContent}</div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) => Math.max(p - 1, 1))
                                            }
                                            disabled={currentPage === 1}
                                            className={`${styles.paginationButton} ${
                                                currentPage === 1 ? styles.disabledPagination : ""
                                            }`}
                                        >
                                            Anterior
                                        </button>
                                        <span className={styles.paginationInfo}>
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                                            }
                                            disabled={currentPage === totalPages}
                                            className={`${styles.paginationButton} ${
                                                currentPage === totalPages
                                                    ? styles.disabledPagination
                                                    : ""
                                            }`}
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className={styles.noWinnersText}>Nenhum ganhador encontrado.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );

    function buildRenderedContent(paginatedWinners: FlattenedItem[]) {
        return paginatedWinners.map((item) =>
            item.type === "date" ? (
                <div key={item.date} className={styles.dateSection}>
                    <h3 className={styles.dateHeader}>Data do Sorteio: {item.date}</h3>
                </div>
            ) : (
                <GanhadorCard key={item.winner.id} winner={item.winner} />
            )
        );
    }

    function handleCheckboxChange(
        modality: string,
        selectedModalities: string[],
        setSelectedModalities: (val: string[]) => void
    ) {
        if (modality === "Todos") {
            if (selectedModalities.includes("Todos")) {
                setSelectedModalities([]);
            } else {
                setSelectedModalities(["Todos"]);
            }
            return;
        }
        if (selectedModalities.includes("Todos")) {
            setSelectedModalities([modality]);
            return;
        }
        if (selectedModalities.includes(modality)) {
            setSelectedModalities(selectedModalities.filter((m) => m !== modality));
        } else {
            setSelectedModalities([...selectedModalities, modality]);
        }
    }

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

    function flattenGroupedWinners(groups: GroupedWinners[]): FlattenedItem[] {
        const result: FlattenedItem[] = [];
        for (const g of groups) {
            result.push({ type: "date", date: g.sorteioDate });
            for (const w of g.winners) {
                result.push({ type: "winner", winner: w });
            }
        }
        return result;
    }
}
