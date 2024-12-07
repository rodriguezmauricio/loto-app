"use client";

import { useState, useEffect } from "react";
import styles from "./ganhadores.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tempDb } from "../../../tempDb";
import GanhadoresCards from "components/ganhadoresTable/GanhadoresCards";
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

// This map must match the keys used in tempDb for each modalidade type.
const modalidadeKeyMap: { [key: string]: string } = {
    Caixa: "Caixa",
    Surpresinha: "Sabedoria",
    Personalizado: "Personalizada",
};

export default function GanhadoresPage() {
    const [modalidade, setModalidade] = useState<string>("");
    const [loterias, setLoterias] = useState<string[]>([]);
    const [selectedLoteria, setSelectedLoteria] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Update loterias when modalidade changes
    useEffect(() => {
        if (modalidade) {
            const modalidadeKey = modalidadeKeyMap[modalidade];
            if (modalidadeKey) {
                const modalidadeData = tempDb.modalidades.find(
                    (mod) => Object.keys(mod)[0] === modalidadeKey
                ) as any;

                if (modalidadeData && modalidadeData[modalidadeKey]) {
                    const loteriasList = modalidadeData[modalidadeKey].map((lot: any) => lot.name);
                    setLoterias(loteriasList);
                } else {
                    setLoterias([]);
                }
            } else {
                setLoterias([]);
            }
            setSelectedLoteria("");
            setSelectedDate(null);
            setWinners([]);
            setAvailableDates([]);
        } else {
            setLoterias([]);
            setSelectedLoteria("");
            setSelectedDate(null);
            setWinners([]);
            setAvailableDates([]);
        }
    }, [modalidade]);

    // Fetch available dates when selectedLoteria or modalidade changes
    useEffect(() => {
        const fetchAvailableDates = async () => {
            if (!selectedLoteria || !modalidade) {
                setAvailableDates([]);
                return;
            }

            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("modalidade", modalidade);
                params.append("loteria", selectedLoteria);

                const response = await fetch(`/api/sorteios/dates?${params.toString()}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar datas disponíveis.");
                }

                const data = await response.json();
                const dates: string[] = data.dates || [];
                const parsedDates = dates.map((d) => new Date(d + "T00:00:00Z"));
                setAvailableDates(parsedDates);
            } catch (error: any) {
                console.error("Error fetching available dates:", error);
                toast.error(error.message || "Erro ao buscar datas disponíveis.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedLoteria && modalidade) {
            fetchAvailableDates();
        }
    }, [selectedLoteria, modalidade]);

    const handleFetchWinners = async () => {
        if (!selectedLoteria || !modalidade) {
            toast.error("Por favor, selecione a modalidade e a loteria antes de buscar.");
            return;
        }

        setLoading(true);
        setWinners([]);
        try {
            const params = new URLSearchParams();
            // this params are swapped to get the correct result from the mess up in the database I've made before
            params.append("modalidade", selectedLoteria);
            params.append("loteria", modalidade);

            if (selectedDate) {
                const dateStr = selectedDate.toISOString().split("T")[0];
                params.append("startDate", dateStr);
                params.append("endDate", dateStr);
            }

            const response = await fetch(`/api/ganhadores?${params.toString()}`, {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.error)
                        ? data.error.map((err: any) => err).join(", ")
                        : data.error
                );
            }

            setWinners(data.winners || []);
            if (data.winners && data.winners.length > 0) {
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

    const groupWinnersByDate = (): { sorteioDate: string; winners: WinnerBet[] }[] => {
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
    };

    const groupedWinners = groupWinnersByDate();

    return (
        <>
            <ToastContainer />
            <PageHeader title="Ganhadores" subpage={false} linkTo={""} />
            <main className="main">
                <section>
                    <div className={styles.filterRow}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="modalidade">Modalidade:</label>
                            <select
                                id="modalidade"
                                value={modalidade}
                                onChange={(e) => setModalidade(e.target.value)}
                            >
                                <option value="">Selecione a Modalidade</option>
                                <option value="Caixa">Caixa</option>
                                <option value="Surpresinha">Surpresinha</option>
                                <option value="Personalizado">Personalizado</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label htmlFor="loteria">Loteria:</label>
                            <select
                                id="loteria"
                                value={selectedLoteria}
                                onChange={(e) => setSelectedLoteria(e.target.value)}
                                disabled={!modalidade}
                            >
                                <option value="">Selecione a Loteria</option>
                                {loterias.map((lot) => (
                                    <option key={lot} value={lot}>
                                        {lot}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label htmlFor="sorteioDate">Data do Sorteio:</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                highlightDates={availableDates}
                                placeholderText="Selecione uma data"
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

                    {groupedWinners.length > 0 ? (
                        <section className={styles.resultsSection}>
                            {groupedWinners.map((group) => (
                                <div key={group.sorteioDate} className={styles.dateGroup}>
                                    <h3>Data do Sorteio: {group.sorteioDate}</h3>
                                    <div className={styles.winnersList}>
                                        {group.winners.map((w) => (
                                            <GanhadorCard
                                                key={w.id}
                                                username={w.userName}
                                                numbers={w.numbers}
                                                prize={w.premio.toFixed(2)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        <p>Nenhum ganhador encontrado.</p>
                    )}
                </section>
            </main>
        </>
    );
}
