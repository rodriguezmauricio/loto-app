// src/app/(authenticated)/apostadores/[apostadorId]/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./apostadorId.module.scss";
import IconCard from "components/iconCard/IconCard";
import Title from "components/title/Title";
import Filter from "components/filter/Filter";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Modal from "components/modal/Modal";
import TicketList from "components/ticketList/TicketList";
import { Bilhete } from "../../../../types/roles";

// Define Wallet Interface
interface Wallet {
    id: string;
    balance: number;
    transactions: any[]; // Replace `any[]` with the appropriate type if available
    // Add other fields as necessary
}

// Define Apostador Interface
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
    // Router and Params
    const router = useRouter();
    const params = useParams();
    const { apostadorId } = params;

    // Session Management
    const { data: session, status } = useSession();

    // State Variables
    const [apostadorData, setApostadorData] = useState<Apostador | null>(null);
    const [bilhetes, setBilhetes] = useState<Bilhete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State Variables
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    // Balance Update Variables
    const [operation, setOperation] = useState<string>("add"); // "add" or "subtract"
    const [amount, setAmount] = useState<string>("");

    // Calculate Balance Display
    const balanceValue = apostadorData?.wallet?.balance;
    let balanceDisplay = "Indisponível";

    if (balanceValue !== null && balanceValue !== undefined) {
        const numericBalance = Number(balanceValue);
        if (!isNaN(numericBalance)) {
            balanceDisplay = numericBalance.toFixed(2);
        }
    }

    // Handlers for Modal
    const openModal = () => {
        console.log("openModal called"); // Debugging
        setUpdateError(null);
        setIsUpdating(false);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // Fetch Apostador and Bilhetes
    useEffect(() => {
        if (!apostadorId || status !== "authenticated") return;

        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Include cookies for authentication
                });
                const data = await response.json();

                if (response.ok) {
                    setApostadorData(data);
                } else {
                    setError(data.error || "Erro ao buscar apostador.");
                }
            } catch (err) {
                console.error("Error fetching apostador:", err);
                setError("Erro ao buscar apostador.");
            }
        };

        const fetchBilhetes = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}/bilhetes`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const data = await response.json();

                if (response.ok) {
                    setBilhetes(data.bilhetes);
                } else {
                    setError(data.error || "Erro ao buscar bilhetes.");
                }
            } catch (err) {
                console.error("Error fetching bilhetes:", err);
                setError("Erro ao buscar bilhetes.");
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchApostador(), fetchBilhetes()]);
            setLoading(false);
        };

        fetchData();
    }, [apostadorId, status]);

    // Handle Unauthorized Access
    useEffect(() => {
        if (error === "Acesso negado.") {
            alert("Você não tem permissão para visualizar este apostador.");
            router.push("/apostadores"); // Redirect to the apostadores list
        }
    }, [error, router]);

    // Loading State
    if (loading || status === "loading") {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Carregando detalhes do apostador...</p>
                </main>
            </>
        );
    }

    // Authentication Check
    if (status === "unauthenticated") {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Você precisa estar logado para ver esta página.</p>
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

    // Handler for Balance Update
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
                    credentials: "include",
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
            // Reset form fields
            setAmount("");
            setOperation("add");
        } catch (err: any) {
            console.error("Error updating wallet balance:", err);
            setUpdateError(err.message || "Erro ao atualizar saldo.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handler for Editing Apostador
    const handleEdit = () => {
        router.push(`/apostadores/${apostadorId}/profile/edit`);
    };

    // Handler for Deleting Apostador
    const handleDelete = async () => {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este apostador?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/users/${apostadorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
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

    // Render the component
    return (
        <>
            <PageHeader
                title={`Apostador: ${apostadorData.username}`}
                subpage
                linkTo={`/apostadores`}
            />
            <main className="main">
                {/* Modal for Balance Update */}
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <form onSubmit={handleBalanceUpdate} className={styles.modalForm}>
                            <h2>Atualizar Saldo</h2>
                            {updateError && <p className={styles.error}>{updateError}</p>}
                            <div className={styles.formGroup}>
                                <label htmlFor="operation">Operação:</label>
                                <select
                                    id="operation"
                                    value={operation}
                                    onChange={(e) => setOperation(e.target.value)}
                                    required
                                >
                                    <option value="add">Adicionar</option>
                                    <option value="subtract">Subtrair</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="amount">Valor:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={styles.submitButton}
                            >
                                {isUpdating ? "Atualizando..." : "Atualizar Saldo"}
                            </button>
                        </form>
                    </Modal>
                )}

                {/* Apostador and Wallet Info */}
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
                    {/* {apostadorData.wallet ? ( */}
                    <IconCard
                        title="Carteira"
                        description={`Saldo: R$ ${balanceDisplay}`}
                        icon="wallet"
                        inIcon
                        fullWidth={false}
                        hasCheckbox={false}
                        isClickable={true}
                        onClick={openModal} // Make the wallet card clickable to open the modal
                    />
                    {/* ) : (
                        <IconCard
                            title="Carteira"
                            description="Saldo e transações"
                            icon="wallet"
                            inIcon
                            fullWidth={false}
                            hasCheckbox={false}
                            isClickable={true}
                            onClick={() => {
                                console.log("openModal");
                            }} // Make the wallet card clickable to open the modal
                            linkTo={""}
                        />
                    )} */}
                </section>

                {/* Bilhetes Section */}
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
                            {/* Add other buttons here if necessary */}
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
