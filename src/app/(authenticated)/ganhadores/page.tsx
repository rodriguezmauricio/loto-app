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

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
    betPlacedDate: string; // New field
}

interface GroupedWinners {
    sorteioDate: string;
    winners: WinnerBet[];
}

type FlattenedItem = { type: "date"; date: string } | { type: "winner"; winner: WinnerBet };

const categoryMap: { [key: string]: ModalidadeKey } = {
    Caixa: "Caixa",
    Surpresinha: "Sabedoria",
    Personalizada: "Personalizada",
};

export default function GanhadoresPage() {
    const [category, setCategory] = useState<string>("");
    const [modalities, setModalities] = useState<string[]>([]);
    const [selectedModalities, setSelectedModalities] = useState<string[]>(["Todos"]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const perPage = 10;

    useEffect(() => {
        setSelectedModalities(["Todos"]);
        setWinners([]);
        setCurrentPage(1);

        if (!category) {
            setModalities([]);
            return;
        }

        const catKey = categoryMap[category as keyof typeof categoryMap];
        const foundCategory = tempDb.modalidades.find((mod: Modalidade) => mod[catKey]);

        if (foundCategory) {
            if (catKey === "Caixa" && "Caixa" in foundCategory) {
                const caixas = foundCategory.Caixa as ModalidadeCaixa[];
                const loteriasList = caixas.map((lot) => lot.name);
                setModalities(loteriasList);
            } else if (catKey === "Sabedoria" && "Sabedoria" in foundCategory) {
                const sabedorias = foundCategory.Sabedoria as ModalidadeSabedoria[];
                const loteriasList = sabedorias.map((lot) => lot.name);
                setModalities(loteriasList);
            } else if (catKey === "Personalizada" && "Personalizada" in foundCategory) {
                const personalizadas = foundCategory.Personalizada as ModalidadePersonalizada[];
                const loteriasList = personalizadas.map((lot) => lot.name);
                setModalities(loteriasList);
            } else {
                setModalities([]);
            }
        } else {
            setModalities([]);
        }
    }, [category]);

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

        let finalStartDate = startDate ? startDate.toISOString().split("T")[0] : undefined;
        let finalEndDate = endDate ? endDate.toISOString().split("T")[0] : undefined;

        if (finalStartDate && !finalEndDate) {
            finalEndDate = new Date().toISOString().split("T")[0];
        }

        try {
            const allResults: WinnerBet[] = [];

            const fetchPromises = modalitiesToFetch.map(async (modName) => {
                const params = new URLSearchParams();
                params.append("modalidade", modName);
                params.append("loteria", modalidadeParam);
                if (finalStartDate) params.append("startDate", finalStartDate);
                if (finalEndDate) params.append("endDate", finalEndDate);

                const response = await fetch(`/api/ganhadores?${params.toString()}`, {
                    method: "GET",
                });
                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        `Error fetching winners for ${modName}:`,
                        data.error || response.statusText
                    );
                    // toast.error(
                    //     `Erro ao buscar ganhadores para ${modName}: ${
                    //         data.error || "Erro desconhecido."
                    //     }`
                    // );
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
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return a.modalidade.localeCompare(b.modalidade);
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

    groupedWinners.sort((a, b) => {
        const dateA = new Date(a.sorteioDate);
        const dateB = new Date(b.sorteioDate);
        return dateB.getTime() - dateA.getTime();
    });

    const flattened = flattenGroupedWinners(groupedWinners);
    const totalPages = Math.ceil(flattened.length / perPage);
    const paginatedWinners = flattened.slice((currentPage - 1) * perPage, currentPage * perPage);

    const renderedContent = buildRenderedContent(paginatedWinners);

    return (
        <>
            <ToastContainer />
            <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
            <main className="main">
                <section>
                    <div className={styles.filterRow}>
                        <div className={styles.categoriesGroup}>
                            <label>Categorias:</label>
                            <div className={styles.categoryButtons}>
                                <SimpleButton
                                    btnTitle="Caixa"
                                    onClick={() => setCategory("Caixa")}
                                    className={category === "Caixa" ? "selectedCategory" : ""}
                                    func={() => setCategory("Caixa")}
                                    isSelected={true}
                                />
                                <SimpleButton
                                    btnTitle="Surpresinha"
                                    onClick={() => setCategory("Surpresinha")}
                                    className={category === "Surpresinha" ? "selectedCategory" : ""}
                                    func={() => setCategory("Surpresinha")}
                                    isSelected={true}
                                />

                                <SimpleButton
                                    btnTitle="Personalizada"
                                    onClick={() => setCategory("Personalizada")}
                                    className={
                                        category === "Personalizada" ? "selectedCategory" : ""
                                    }
                                    func={() => setCategory("Personalizada")}
                                    isSelected={true}
                                />
                            </div>
                        </div>

                        {category && (
                            <div className={styles.modalidadesGroup}>
                                <label>Modalidades:</label>
                                <div className={styles.modalidadesOptions}>
                                    <label
                                        className={`todosOption ${
                                            selectedModalities.includes("Todos") ? "selected" : ""
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
                                        />
                                        Todos
                                    </label>
                                    {modalities.map((mod) => (
                                        <label
                                            key={mod}
                                            className={
                                                selectedModalities.includes(mod) &&
                                                !selectedModalities.includes("Todos")
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedModalities.includes("Todos")
                                                        ? false
                                                        : selectedModalities.includes(mod)
                                                }
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

                        <div className={styles.filterGroup}>
                            <label>Data Inicial:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Data inicial"
                                maxDate={endDate || new Date()}
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
                                minDate={startDate || undefined} // Updated line
                                maxDate={new Date()}
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

                    <div className={styles.winnersSection}>
                        {renderedContent.length > 0 ? (
                            renderedContent
                        ) : (
                            <p>Nenhum ganhador encontrado.</p>
                        )}

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

    function buildRenderedContent(paginatedWinners: FlattenedItem[]) {
        let currentDate: string | null = null;
        let currentWinners: WinnerBet[] = [];
        const sections: JSX.Element[] = [];

        for (const item of paginatedWinners) {
            if (item.type === "date") {
                if (currentDate) {
                    sections.push(
                        <div key={currentDate}>
                            <h3 className="dateHeader">Data do Sorteio: {currentDate}</h3>
                            <div className="winnersList">
                                {currentWinners.map((w) => (
                                    <GanhadorCard
                                        key={w.id}
                                        username={w.userName}
                                        numbers={w.numbers}
                                        prize={w.premio.toFixed(2)}
                                        modalidade={w.modalidade}
                                        sorteioDate={w.sorteioDate}
                                        betPlacedDate={w.betPlacedDate} // Pass the new field
                                    />
                                ))}
                            </div>
                        </div>
                    );
                }
                currentDate = item.date;
                currentWinners = [];
            } else {
                currentWinners.push(item.winner);
            }
        }

        if (currentDate) {
            sections.push(
                <div key={currentDate}>
                    <h3 className="dateHeader">Data do Sorteio: {currentDate}</h3>
                    <div className="winnersList">
                        {currentWinners.map((w) => (
                            <GanhadorCard
                                key={w.id}
                                username={w.userName}
                                numbers={w.numbers}
                                prize={w.premio.toFixed(2)}
                                modalidade={w.modalidade}
                                sorteioDate={w.sorteioDate}
                                betPlacedDate={w.betPlacedDate} // Pass the new field
                            />
                        ))}
                    </div>
                </div>
            );
        }

        return sections;
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
