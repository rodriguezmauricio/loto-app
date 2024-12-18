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
import { useDataStore } from "../../../../../store/useDataStore";
import { Apostador, Wallet } from "../../../../types/apostador";

// Adjust your interfaces to match your data

const ApostadorDetail = () => {
    const router = useRouter();
    const params = useParams();

    // Handle apostadorId as a string
    const paramApostadorId = Array.isArray(params.apostadorId)
        ? params.apostadorId[0]
        : params.apostadorId;
    const apostadorId: string = paramApostadorId as string;

    const { data: session, status } = useSession();
    const { apostadores, getApostadorById, fetchApostadores } = useDataStore();

    const [apostadorData, setApostadorData] = useState<Apostador | null>(null);
    const [bilhetes, setBilhetes] = useState<Bilhete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const [operation, setOperation] = useState<string>("add");
    const [amount, setAmount] = useState<string>("");

    useEffect(() => {
        if (status !== "authenticated") return;
        setLoading(true);

        const apostador = getApostadorById(apostadorId);
        if (!apostador) {
            // If not found in store, fetch from backend
            fetchApostadores()
                .then(() => {
                    const fetched = getApostadorById(apostadorId);
                    console.log("Fetched Apostador:", fetched); // Log fetched data
                    if (!fetched) {
                        setError("Apostador não encontrado.");
                    } else {
                        setApostadorData(fetched);
                    }
                    setLoading(false);
                })
                .catch((err: any) => {
                    console.error(err);
                    setError("Erro ao buscar apostador.");
                    setLoading(false);
                });
        } else {
            console.log("Apostador found in store:", apostador); // Log existing data
            setApostadorData(apostador);
            setLoading(false);
        }
    }, [apostadorId, status, fetchApostadores, getApostadorById]);

    useEffect(() => {
        if (error === "Acesso negado.") {
            alert("Você não tem permissão para visualizar este apostador.");
            router.push("/apostadores");
        }
    }, [error, router]);

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

    const balanceValue = apostadorData?.wallet?.balance;
    console.log("Apostador Wallet Balance Value:", balanceValue);

    let balanceDisplay = "Indisponível";

    if (balanceValue !== null && balanceValue !== undefined) {
        const numericBalance = Number(balanceValue);
        if (!isNaN(numericBalance)) {
            balanceDisplay = numericBalance.toFixed(2);
        }
    }

    console.log("Balance Display:", balanceDisplay);

    const openModal = () => {
        setUpdateError(null);
        setIsUpdating(false);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleBalanceUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateError(null);

        try {
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new Error("Por favor, insira um valor válido maior que zero.");
            }

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
            setApostadorData((prev) =>
                prev
                    ? {
                          ...prev,
                          wallet: updatedWallet,
                      }
                    : prev
            );

            closeModal();
            setAmount("");
            setOperation("add");
        } catch (err: any) {
            console.error("Error updating wallet balance:", err);
            setUpdateError(err.message || "Erro ao atualizar saldo.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEdit = () => {
        router.push(`/apostadores/${apostadorId}/profile/edit`);
    };

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
            router.push("/apostadores");
        } catch (err: any) {
            console.error("Error deleting apostador:", err);
            alert(err.message || "Erro ao excluir apostador.");
        }
    };

    console.log("Rendering Wallet IconCard with balance:", balanceDisplay);

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

                <section className={styles.row}>
                    <IconCard
                        title={apostadorData.username}
                        description={`Telefone: ${apostadorData.phone || "N/A"}`}
                        icon="user"
                        inIcon={false}
                        fullWidth={false}
                        hasCheckbox={false}
                        isClickable={true}
                        linkTo={`/apostadores/${apostadorData.id}/profile`}
                    />

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
                        </div>
                    </section>
                    <section>
                        <TicketList userId={apostadorId} />
                    </section>
                </section>

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
