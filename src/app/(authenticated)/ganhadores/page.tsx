// app/(authenticated)/ganhadores/page.tsx

"use client";

import { useState, useEffect } from "react";
import styles from "./ganhadores.module.css";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import GanhadoresCards from "components/ganhadoresTable/GanhadoresCards";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
// import ptBR from "date-fns/locale/pt-BR";

// registerLocale("pt-BR", ptBR);

import { tempDb } from "../../../tempDb";

interface WinnerBet {
    // ... your existing interface
}

const GanhadoresPage = () => {
    const [modalidades] = useState<string[]>(["Caixa", "Surpresinha", "Personalizado"]);
    const [selectedModalidade, setSelectedModalidade] = useState<string>("");
    const [loterias, setLoterias] = useState<string[]>([]);
    const [selectedLoteria, setSelectedLoteria] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [winners, setWinners] = useState<WinnerBet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Mapping between selected modalidade and tempDb keys
    const modalidadeKeyMap: { [key: string]: string } = {
        Caixa: "modalidadesCaixa",
        Surpresinha: "modalidadeSabedoria",
        Personalizado: "modalidadePersonalizada",
    };

    const updateLoterias = () => {
        if (selectedModalidade) {
            const modalidadeKey = modalidadeKeyMap[selectedModalidade];
            if (modalidadeKey) {
                const modalidadeData = tempDb.modalidades.find(
                    (mod) => Object.keys(mod)[0] === modalidadeKey
                );
                if (modalidadeData && modalidadeData[modalidadeKey]) {
                    const loteriasList = modalidadeData[modalidadeKey].map((lot: any) => lot.name);
                    setLoterias(loteriasList);
                } else {
                    setLoterias([]);
                }
            } else {
                setLoterias([]);
            }
        } else {
            setLoterias([]);
        }
    };

    // Update loterias when selectedModalidade changes
    useEffect(() => {
        updateLoterias();
        setSelectedLoteria("");
    }, [selectedModalidade]);

    // Fetch available dates when selectedLoteria changes
    useEffect(() => {
        const fetchAvailableDates = async () => {
            if (selectedLoteria) {
                const response = await fetch(`/api/sorteios/dates?modalidade=${selectedLoteria}`);
                const data = await response.json();
                const dates = data.dates.map((dateStr: string) => new Date(dateStr));
                setAvailableDates(dates);
            } else {
                setAvailableDates([]);
            }
        };

        fetchAvailableDates();
    }, [selectedLoteria]);

    // Fetch winners
    const handleFetchWinners = async () => {
        if (!selectedLoteria && !selectedDate) {
            toast.error("Por favor, selecione pelo menos a loteria ou uma data.");
            return;
        }

        setLoading(true);
        setWinners([]);

        try {
            const params = new URLSearchParams();

            if (selectedLoteria) {
                params.append("modalidade", selectedLoteria);
            }

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
                        ? data.error.map((err: any) => err.message).join(", ")
                        : data.error
                );
            }

            setWinners(data.winners);
            toast.success("Ganhadores buscados com sucesso!");
        } catch (error: any) {
            console.error("Error fetching winners:", error);
            toast.error(error.message || "Erro ao buscar ganhadores.");
        } finally {
            setLoading(false);
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
                        {/* Modalidade Dropdown */}
                        <div className={styles.filterGroup}>
                            <label htmlFor="modalidade">Modalidade:</label>
                            <select
                                id="modalidade"
                                value={selectedModalidade}
                                onChange={(e) => setSelectedModalidade(e.target.value)}
                            >
                                <option value="">Selecione a Modalidade</option>
                                {modalidades.map((mod) => (
                                    <option key={mod} value={mod}>
                                        {mod}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Loteria Dropdown */}
                        <div className={styles.filterGroup}>
                            <label htmlFor="loteria">Loteria:</label>
                            <select
                                id="loteria"
                                value={selectedLoteria}
                                onChange={(e) => setSelectedLoteria(e.target.value)}
                                disabled={!selectedModalidade}
                            >
                                <option value="">Selecione a Loteria</option>
                                {loterias.map((lot) => (
                                    <option key={lot} value={lot}>
                                        {lot}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Picker */}
                        <div className={styles.filterGroup}>
                            <label htmlFor="sorteioDate">Data do Sorteio:</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date) => setSelectedDate(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                highlightDates={availableDates}
                                placeholderText="Selecione uma data"
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
                    </div>

                    {/* Display Winners */}
                    <GanhadoresCards winners={winners} loading={loading} />
                </section>
            </main>
        </>
    );
};

export default GanhadoresPage;
