// components/ganhadoresTable/GanhadoresTable.tsx

import React from "react";
import Card from "../card/Card";
import Title from "../title/Title";
import styles from "./ganhadoresTable.module.css";
import { ClipLoader } from "react-spinners";
interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
}

interface GanhadoresTableProps {
    winners: WinnerBet[];
    loading: boolean;
}

const GanhadoresTable: React.FC<GanhadoresTableProps> = ({ winners, loading }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Title h={2}>Ganhadores</Title>
                <span className={styles.subtitle}>
                    {loading ? "Carregando ganhadores..." : "Lista de ganhadores"}
                </span>
            </header>

            <section>
                {/* Summary Cards */}
                <div className={styles.summaryRow}>
                    <Card
                        title="Data dos Sorteios"
                        value={new Date().toLocaleDateString("pt-BR")}
                        color="none"
                        big={false}
                        money={false}
                    />
                    <Card
                        title="Bilhetes premiados"
                        value={winners.length}
                        color="yellow"
                        big={false}
                        money={false}
                    />
                    <Card
                        title="Total em premiações"
                        value={winners.reduce((acc, bet) => acc + bet.premio, 0)}
                        color="red"
                        big={false}
                        money={true}
                    />
                </div>

                {/* Winners Table */}
                {loading ? (
                    <div className={styles.spinnerContainer}>
                        <ClipLoader color="#0070f3" loading={loading} size={50} />
                        <p>Carregando ganhadores...</p>
                    </div>
                ) : winners.length === 0 ? (
                    <p>Nenhum ganhador encontrado para os filtros selecionados.</p>
                ) : (
                    <table className={styles.winnersTable}>
                        <thead>
                            <tr>
                                <th>ID do Bilhete</th>
                                <th>Números</th>
                                <th>Modalidade</th>
                                <th>ID do Usuário</th>
                                <th>Nome do Usuário</th>
                                <th>Data do Sorteio</th>
                                <th>Prêmio</th>
                                {/* Add more headers as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {winners.map((bet) => (
                                <tr key={bet.id}>
                                    <td>{bet.id}</td>
                                    <td>{bet.numbers.join(", ")}</td>
                                    <td>{bet.modalidade}</td>
                                    <td>{bet.userId}</td>
                                    <td>{bet.userName}</td>
                                    <td>{bet.sorteioDate}</td>
                                    <td>
                                        {bet.premio.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </td>
                                    {/* Add more cells as needed */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default GanhadoresTable;
