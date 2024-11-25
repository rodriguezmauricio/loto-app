// app/(authenticated)/apostadores/[apostadorId]/page.tsx

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
    const [bets, setBets] = useState<any[]>([]);
    const [loadingApostador, setLoadingApostador] = useState<boolean>(true);
    const [errorApostador, setErrorApostador] = useState<string | null>(null);

    // New state variables for bets
    const [loadingBets, setLoadingBets] = useState<boolean>(true);
    const [errorBets, setErrorBets] = useState<string | null>(null);

    // Modal state variables
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newBalance, setNewBalance] = useState<string>("");
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const balanceValue = apostadorData?.wallet?.balance;
    let balanceDisplay = "Indisponível";

    const [operation, setOperation] = useState<string>("add");
    const [amount, setAmount] = useState<string>("");

    const openModal = () => {
        setNewBalance(apostadorData?.wallet?.balance.toString() || "");
        setUpdateError(null);
        setIsUpdating(false);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        // Fetch Apostador Data
        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar apostador.");
                }

                const data: Apostador = await response.json();
                setApostadorData(data);
            } catch (err: any) {
                console.error("Error fetching apostador:", err);
                setErrorApostador(err.message || "Erro ao buscar apostador.");
            } finally {
                setLoadingApostador(false);
            }
        };

        fetchApostador();
    }, [apostadorId]);

    // Fetch Bets Data
    useEffect(() => {
        const fetchBets = async () => {
            setLoadingBets(true);
            try {
                const response = await fetch(`/api/apostas?userId=${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar bilhetes.");
                }

                const data = await response.json();
                setBets(data);
            } catch (err: any) {
                console.error("Error fetching bets:", err);
                setErrorBets(err.message || "Erro ao buscar bilhetes.");
            } finally {
                setLoadingBets(false);
            }
        };

        fetchBets();
    }, [apostadorId]);

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
                `/api/users/${apostadorData?.id}/wallets/${apostadorData?.wallet?.id}`,
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

    if (balanceValue !== null && balanceValue !== undefined) {
        const numericBalance = Number(balanceValue);
        if (!isNaN(numericBalance)) {
            balanceDisplay = numericBalance.toFixed(2);
        }
    }

    // Handle Unauthorized Access
    useEffect(() => {
        if (errorApostador === "Acesso negado.") {
            alert("Você não tem permissão para visualizar este apostador.");
            router.push("/apostadores"); // Redirect to the apostadores list
        }
    }, [errorApostador, router]);

    // Loading States
    if (loadingApostador) {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Carregando detalhes do apostador...</p>
                </main>
            </>
        );
    }

    // Error States
    if (errorApostador) {
        return (
            <>
                <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Erro: {errorApostador}</p>
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

    console.log("Balance value:", apostadorData?.wallet?.balance);
    console.log("Balance type:", typeof apostadorData?.wallet?.balance);

    return (
        <>
            <PageHeader
                title={`Apostador: ${apostadorData.username}`}
                subpage
                linkTo={`/apostadores`}
            />
            <main className="main">
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <h2 style={{ color: "#000" }}>Atualizar Saldo da Carteira</h2>
                        <p style={{ color: "#000" }}>
                            Saldo atual: <strong>R$ {balanceDisplay}</strong>
                        </p>
                        <form onSubmit={handleBalanceUpdate} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="operation"
                                    className={styles.formLabel}
                                    style={{ color: "#000" }}
                                >
                                    Operação:
                                </label>
                                <select
                                    id="operation"
                                    value={operation}
                                    onChange={(e) => setOperation(e.target.value)}
                                    required
                                    className={styles.formSelect}
                                >
                                    <option value="add">Adicionar</option>
                                    <option value="subtract">Subtrair</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="amount"
                                    className={styles.formLabel}
                                    style={{ color: "#000" }}
                                >
                                    Valor:
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    required
                                    disabled={isUpdating}
                                    className={styles.formInput}
                                />
                            </div>

                            {updateError && <p className={styles.errorText}>{updateError}</p>}
                            <div className={styles.modalActions}>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className={styles.primaryButton}
                                >
                                    {isUpdating ? "Atualizando..." : "Atualizar"}
                                </button>
                                <button type="button" onClick={closeModal} disabled={isUpdating}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                        {updateError && <p className={styles.errorText}>{updateError}</p>}
                    </Modal>
                )}
                <section className={styles.row}>
                    {/* Apostador Info */}
                    <IconCard
                        title={apostadorData.username}
                        description={`Telefone: ${apostadorData.phone}`}
                        icon="user"
                        inIcon={false}
                        fullWidth={false}
                        hasCheckbox={false}
                        isClickable={true} // Make it clickable
                        linkTo={`/apostadores/${apostadorData.id}/profile`} // Navigate to profile page
                    />

                    {/* Carteira Info */}
                    {apostadorData?.wallet ? (
                        <IconCard
                            title="Carteira"
                            description={`Saldo: R$ ${balanceDisplay}`}
                            icon="wallet"
                            inIcon
                            fullWidth={false}
                            hasCheckbox={false}
                            isClickable={true}
                            onClick={openModal} // Open modal on click
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
                            <SimpleButton
                                btnTitle="Excluir Bilhete"
                                type="button"
                                func={() => {}}
                                isSelected={false}
                            />
                            <SimpleButton
                                btnTitle="Repetir Bilhete"
                                type="button"
                                func={() => {}}
                                isSelected={false}
                            />
                            <SimpleButton
                                btnTitle="Compartilhar Bilhete"
                                type="button"
                                func={() => {}}
                                isSelected={false}
                            />
                        </div>
                    </section>

                    {/* Bets List */}
                    <section>
                        {/* {loadingBets ? (
                            <p>Carregando bilhetes...</p>
                        ) : errorBets ? (
                            <p>Erro ao carregar bilhetes: {errorBets}</p>
                        ) : bets.length > 0 ? (
                            <div className={styles.betsGrid}>
                                {bets.map((bet) => (
                                    <BetCard key={bet.id} bet={bet} />
                                ))}
                            </div>
                        ) : (
                            <p>Nenhum bilhete encontrado.</p>
                        )} */}

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
