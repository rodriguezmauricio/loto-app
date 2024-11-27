// src/components/ticketList/TicketList.tsx

import React, { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Title from "components/title/Title";
import ConfirmModal from "components/confirmModal/ConfirmModal";
import styles from "./TicketList.module.scss"; // Ensure this CSS module exists

interface Aposta {
    id: string;
    numeroBilhete: number;
    modalidade: string;
    numbers: number[]; // Changed from numbersArr to numbers
    acertos: number;
    premio: number;
    apostador: string;
    quantidadeDezenas: number;
    resultado: string | null;
    data: string;
    hora: string;
    lote: string;
    consultor: string;
    tipoBilhete: string;
    valorBilhete: number;
    // ... other fields
}

interface TicketListProps {
    userId: string;
}

const TicketList: React.FC<TicketListProps> = ({ userId }) => {
    const [tickets, setTickets] = useState<Aposta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/apostas?userId=${userId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar bilhetes.");
                }
                const data: Aposta[] = await response.json();
                setTickets(data);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [userId]);

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

        try {
            const response = await fetch(`/api/apostas/${ticketToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // Include authentication headers if required
                    // NextAuth.js handles auth via cookies by default
                },
            });

            if (response.ok) {
                // Remove the deleted ticket from the state
                setTickets(tickets.filter((ticket) => ticket.id !== ticketToDelete));
                alert("Bilhete deletado com sucesso.");
                // Alternatively, use a toast notification for better UX
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao deletar bilhete.");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erro desconhecido ao deletar bilhete.");
        } finally {
            closeModal();
        }
    };

    if (loading) {
        return <p>Carregando bilhetes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
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
                        <div>
                            <strong>Número Bilhete:</strong> {ticket.numeroBilhete}
                        </div>
                        <div>
                            <strong>Modalidade:</strong> {ticket.modalidade}
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
                            <strong>Hora:</strong> {new Date(ticket.hora).toLocaleTimeString()}
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
                        <div className={styles.actions}>
                            <SimpleButton
                                btnTitle="Deletar"
                                func={() => openModal(ticket.id)}
                                isSelected={false}
                                className={styles.deleteButton}
                            />
                            {/* You can add more actions like Editar, Visualizar, etc. */}
                        </div>
                    </li>
                ))}
            </ul>
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
