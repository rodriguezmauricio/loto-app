// src/components/ticketList/TicketList.tsx

"use client";

import React, { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Title from "components/title/Title";
import ConfirmModal from "components/confirmModal/ConfirmModal";
import styles from "./TicketList.module.scss"; // Ensure this CSS module exists
import { useDataStore } from "../../../store/useDataStore"; // Adjust the path as necessary

interface TicketListProps {
    userId: string;
}

const TicketList: React.FC<TicketListProps> = ({ userId }) => {
    const {
        tickets,
        loadingTickets,
        errorTickets,
        fetchTickets,
        deleteTicket,
        totalPagesTickets,
        currentPageTickets,
    } = useDataStore();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

    // Fetch tickets when component mounts or when userId changes
    useEffect(() => {
        if (userId) {
            fetchTickets(userId, 1, 10); // Start with page 1 and limit 10
        }
    }, [userId, fetchTickets]);

    const openModal = (id: string) => {
        setTicketToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTicketToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!ticketToDelete) return;
        await deleteTicket(ticketToDelete);
        closeModal();
    };

    const handlePreviousPage = () => {
        if (currentPageTickets > 1) {
            fetchTickets(userId, currentPageTickets - 1, 10);
        }
    };

    const handleNextPage = () => {
        if (currentPageTickets < totalPagesTickets) {
            fetchTickets(userId, currentPageTickets + 1, 10);
        }
    };

    if (loadingTickets) {
        return <p>Carregando bilhetes...</p>;
    }

    if (errorTickets) {
        return <p className={styles.error}>{errorTickets}</p>;
    }

    if (tickets.length === 0) {
        return <p>Nenhum bilhete encontrado.</p>;
    }

    return (
        <div className={styles.ticketListContainer}>
            <Title h={2}>Seus Bilhetes</Title>
            <ul className={styles.ticketList}>
                {tickets.map((ticket) => (
                    <li key={ticket.id} className={styles.ticketItem}>
                        <div className={styles.ticketDetails}>
                            <div>
                                <strong>Número Bilhete:</strong> {ticket.numeroBilhete}
                            </div>
                            <div>
                                <strong>Modalidade:</strong> {ticket.modalidade}
                            </div>
                            <div>
                                <strong>Loteria:</strong> {ticket.loteria}
                            </div>
                            <div>
                                <strong>Números:</strong> {ticket.numbers.join(", ")}
                            </div>
                            <div>
                                <strong>Acertos:</strong> {ticket.acertos}
                            </div>
                            <div>
                                <strong>Prêmio:</strong> R$ {ticket.premio.toFixed(2)}
                            </div>
                            <div>
                                <strong>Apostador:</strong> {ticket.apostador}
                            </div>
                            <div>
                                <strong>Quantidade de Dezenas:</strong> {ticket.quantidadeDezenas}
                            </div>
                            <div>
                                <strong>Resultado:</strong>{" "}
                                {ticket.resultado
                                    ? new Date(ticket.resultado).toLocaleDateString()
                                    : "Ainda não sorteado"}
                            </div>
                            <div>
                                <strong>Data:</strong> {new Date(ticket.data).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Hora:</strong> {ticket.hora} {/* Display directly */}
                            </div>
                            <div>
                                <strong>Lote:</strong> {ticket.lote}
                            </div>
                            <div>
                                <strong>Consultor:</strong> {ticket.consultor}
                            </div>
                            <div>
                                <strong>Tipo Bilhete:</strong> {ticket.tipoBilhete}
                            </div>
                            <div>
                                <strong>Valor Bilhete:</strong> R$ {ticket.valorBilhete.toFixed(2)}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <SimpleButton
                                btnTitle="Deletar"
                                func={() => openModal(ticket.id)}
                                isSelected={false}
                                className={styles.deleteButton}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {/* Pagination Controls */}
            <div className={styles.pagination}>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPageTickets === 1}
                    className={styles.paginationButton}
                >
                    Anterior
                </button>
                <span>
                    Página {currentPageTickets} de {totalPagesTickets}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPageTickets === totalPagesTickets}
                    className={styles.paginationButton}
                >
                    Próxima
                </button>
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onConfirm={confirmDelete}
                message="Tem certeza que deseja deletar este bilhete?"
            />
        </div>
    );
};

export default TicketList;
