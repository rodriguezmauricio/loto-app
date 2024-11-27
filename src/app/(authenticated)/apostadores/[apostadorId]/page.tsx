"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./apostadorId.module.scss";
import IconCard from "components/iconCard/IconCard";
import Title from "components/title/Title";
import Filter from "components/filter/Filter";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Modal from "components/modal/Modal";
import BetCard from "components/BetCard/BetCard";
import TicketList from "components/ticketList/TicketList";
import { Bilhete, User } from "../../../../types/roles";

interface Wallet {
    id: string;
    balance: number;
    transactions: any[]; // Replace `any[]` with the appropriate type if available
    // Add other fields as necessary
}

interface Apostador {
    id: string;
    username: string;
    phone: string;
    pix: string;
    role: string;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string; // ISO date string
    wallet: Wallet | null;
    // Add other fields as necessary
}

const ApostadorDetail = () => {
    //VARS:
    const router = useRouter();
    const params = useParams();
    const { apostadorId } = params;

    const [apostadorData, setApostadorData] = useState<Apostador | null>(null);
    const [bilhetes, setBilhetes] = useState<Bilhete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state variables
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const [operation, setOperation] = useState<string>("add");
    const [amount, setAmount] = useState<string>("");

    const balanceValue = apostadorData?.wallet?.balance;
    let balanceDisplay = "Indisponível";

    if (balanceValue !== null && balanceValue !== undefined) {
        const numericBalance = Number(balanceValue);
        if (!isNaN(numericBalance)) {
            balanceDisplay = numericBalance.toFixed(2);
        }
    }

    const openModal = () => {
        setUpdateError(null);
        setIsUpdating(false);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // Fetch apostador and bilhetes
    useEffect(() => {
        if (!apostadorId) return;

        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`);
                const data = await response.json();

                if (response.ok) {
                    setApostadorData(data);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError("Erro ao buscar apostador.");
            }
        };

        const fetchBilhetes = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}/bilhetes`);
                const data = await response.json();

                if (response.ok) {
                    setBilhetes(data.bilhetes);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError("Erro ao buscar bilhetes.");
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchApostador(), fetchBilhetes()]);
            setLoading(false);
        };

        fetchData();
    }, [apostadorId]);

    // Handle Unauthorized Access
    useEffect(() => {
        if (error === "Acesso negado.") {
            alert("Você não tem permissão para visualizar este apostador.");
            router.push("/apostadores"); // Redirect to the apostadores list
        }
    }, [error, router]);

    // Loading State
    if (loading) {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Carregando detalhes do apostador...</p>
                </main>
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Erro: {error}</p>
                </main>
            </>
        );
    }

    // No Apostador Found
    if (!apostadorData) {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Apostador não encontrado.</p>
                </main>
            </>
        );
    }

    // Handle Balance Update
    const handleBalanceUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateError(null);

        try {
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new Error("Por favor, insira um valor válido maior que zero.");
            }

            // Send the amount and operation to the API
            const response = await fetch(
                `/api/users/${apostadorData.id}/wallets/${apostadorData.wallet?.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ amount: numericAmount, operation }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao atualizar saldo.");
            }

            const updatedWallet: Wallet = await response.json();

            // Update the local state
            setApostadorData((prev) =>
                prev
                    ? {
                          ...prev,
                          wallet: updatedWallet,
                      }
                    : prev
            );

            // Close the modal
            closeModal();
        } catch (err: any) {
            console.error("Error updating wallet balance:", err);
            setUpdateError(err.message || "Erro ao atualizar saldo.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Edit
    const handleEdit = () => {
        router.push(`/apostadores/${apostadorId}/profile/edit`);
    };

    // Handle Delete
    const handleDelete = async () => {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este apostador?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/users/${apostadorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao excluir apostador.");
            }

            alert("Apostador excluído com sucesso!");
            router.push("/apostadores"); // Redirect to the apostadores list
        } catch (err: any) {
            console.error("Error deleting apostador:", err);
            alert(err.message || "Erro ao excluir apostador.");
        }
    };

    console.log("Apostador Data:", apostadorData);
    console.log("Balance value:", balanceValue);

    return (
        <>
            <PageHeader
                title={`Apostador: ${apostadorData.username}`}
                subpage
                linkTo={`/apostadores`}
            />
            <main className="main">
                {isModalOpen && <Modal onClose={closeModal}>{/* Modal content */}</Modal>}
                <section className={styles.row}>
                    {/* Apostador Info */}
                    <IconCard
                        title={apostadorData.username}
                        description={`Telefone: ${apostadorData.phone}`}
                        icon="user"
                        inIcon={false}
                        fullWidth={false}
                        hasCheckbox={false}
                        isClickable={true}
                        linkTo={`/apostadores/${apostadorData.id}/profile`}
                    />

                    {/* Carteira Info */}
                    {apostadorData.wallet ? (
                        <IconCard
                            title="Carteira"
                            description={`Saldo: R$ ${balanceDisplay}`}
                            icon="wallet"
                            inIcon
                            fullWidth={false}
                            hasCheckbox={false}
                            isClickable={true}
                            onClick={openModal}
                        />
                    ) : (
                        <IconCard
                            title="Carteira"
                            description="Saldo e transações"
                            icon="wallet"
                            inIcon
                            fullWidth={false}
                            hasCheckbox={false}
                            isClickable={false}
                        />
                    )}
                </section>

                <section>
                    <Title h={2}>Bilhetes</Title>
                    <section className={styles.buttonFilterRow}>
                        <Filter filtersArr={["todos", "premiados", "excluídos"]} />
                        <div className={styles.divider}></div>
                        <div className={styles.buttonRow}>
                            <SimpleButton
                                btnTitle="Adicionar Bilhete"
                                type="button"
                                func={() => router.push(`/apostadores/${apostadorId}/novoBilhete`)}
                                isSelected={false}
                            />
                            {/* Other buttons */}
                        </div>
                    </section>

                    {/* Bets List */}
                    <section>
                        <TicketList userId={String(apostadorId)} />
                    </section>
                </section>

                {/* Action Buttons */}
                <section className={styles.actions}>
                    <SimpleButton
                        btnTitle="Editar Apostador"
                        type="button"
                        func={handleEdit}
                        isSelected={false}
                    />
                    <SimpleButton
                        btnTitle="Excluir Apostador"
                        type="button"
                        func={handleDelete}
                        isSelected={false}
                    />
                </section>
            </main>
        </>
    );
};

export default ApostadorDetail;
