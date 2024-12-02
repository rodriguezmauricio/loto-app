// src/app/(authenticated)/apostadores/page.tsx

"use client";

import PageHeader from "components/pageHeader/PageHeader";
import IconCard from "components/iconCard/IconCard";
import styles from "./apostadores.module.scss"; // Ensure this CSS module exists
import { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useUserStore } from "../../../../store/useUserStore"; // Ensure correct path
import { BsSearch, BsXLg } from "react-icons/bs";
import ConfirmModal from "components/confirmModal/ConfirmModal";
import { Apostador } from "../../../types/apostador"; // Define this type accordingly
import { Role } from "../../../types/roles";

const ApostadoresPage = () => {
    const user = useUserStore((state) => state.user);
    const [apostadores, setApostadores] = useState<Apostador[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("name_asc");

    // Debounce the search input to prevent excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on new search
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Manage current page for pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1); // To be set based on API response

    useEffect(() => {
        const fetchApostadores = async () => {
            setLoading(true);
            setError(null);

            // Map sortOption to sortField and sortOrder
            let sortField = "username";
            let sortOrder: "asc" | "desc" = "asc";

            switch (sortOption) {
                case "name_asc":
                    sortField = "username";
                    sortOrder = "asc";
                    break;
                case "name_desc":
                    sortField = "username";
                    sortOrder = "desc";
                    break;
                case "date_newest":
                    sortField = "created_on";
                    sortOrder = "desc";
                    break;
                case "date_oldest":
                    sortField = "created_on";
                    sortOrder = "asc";
                    break;
                default:
                    break;
            }

            try {
                const response = await fetch(
                    `/api/users?search=${encodeURIComponent(
                        debouncedSearch
                    )}&role=usuario&sortField=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&limit=10`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar apostadores.");
                }

                const data = await response.json();
                console.log("API response data:", data); // Should log { apostadores: [...], totalPages: 1 }

                let fetchedApostadores: Apostador[] = [];

                if (Array.isArray(data.apostadores)) {
                    fetchedApostadores = data.apostadores;
                } else {
                    console.error("Unexpected data format:", data);
                    throw new Error("Formato de dados inesperado.");
                }

                setApostadores(fetchedApostadores);
                setTotalPages(data.totalPages || 1);
            } catch (err: any) {
                console.error("Error fetching apostadores:", err);
                setError(err.message || "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchApostadores();
    }, [debouncedSearch, sortOption, currentPage]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    // Pagination handlers
    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Delete handlers
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [apostadorToDelete, setApostadorToDelete] = useState<string | null>(null);

    const openModal = (id: string) => {
        setApostadorToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setApostadorToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!apostadorToDelete) return;

        try {
            const response = await fetch(`/api/users/${apostadorToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Remove the deleted apostador from the state
                setApostadores(apostadores.filter((a) => a.id !== apostadorToDelete));
                alert("Apostador deletado com sucesso.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao deletar apostador.");
            }
        } catch (err: any) {
            console.error("Error deleting apostador:", err);
            alert(err.message || "Erro desconhecido ao deletar apostador.");
        } finally {
            closeModal();
        }
    };

    console.log("apostadores: ", apostadores);

    if (loading) {
        return (
            <>
                <PageHeader
                    title="Apostadores"
                    subpage={false}
                    linkTo={""}
                    hasSubMenu
                    submenuType="add"
                    submenuLink="/apostadores/novo"
                />
                <main className="main">
                    <p>Carregando apostadores...</p>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader
                    title="Apostadores"
                    subpage={false}
                    linkTo={""}
                    hasSubMenu
                    submenuType="add"
                    submenuLink="/apostadores/novo"
                />
                <main className="main">
                    <p>Erro: {error}</p>
                </main>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Apostadores"
                subpage={false}
                linkTo={""}
                hasSubMenu
                submenuType="add"
                submenuLink="/apostadores/novo"
            />
            <main className="main">
                {/* Search and Sort Bar */}
                <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputWrapper}>
                            <BsSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Buscar por nome..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            {searchQuery && (
                                <BsXLg
                                    className={styles.clearIcon}
                                    onClick={handleClearSearch}
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.sortContainer}>
                        <label htmlFor="sort">Ordenar por:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={handleSortChange}
                            className={styles.sortSelect}
                        >
                            <option value="name_asc">Nome (A-Z)</option>
                            <option value="name_desc">Nome (Z-A)</option>
                            <option value="date_newest">Data de Criação (Mais Recentes)</option>
                            <option value="date_oldest">Data de Criação (Mais Antigas)</option>
                        </select>
                    </div>
                </div>

                {/* Apostadores List */}
                {apostadores.length === 0 ? (
                    <p>Nenhum apostador encontrado.</p>
                ) : (
                    <div className={styles.cardContainer}>
                        {apostadores.map((apostador) => (
                            <IconCard
                                key={apostador.id}
                                title={apostador.username}
                                description={`Telefone: ${apostador.phone}`}
                                icon="user"
                                linkTo={`/apostadores/${apostador.id}`} // Adjust the link as necessary
                                isClickable={true}
                                extraInfo={`Criado em: ${new Date(
                                    apostador.created_on
                                ).toLocaleDateString()}`}
                                searchTerm={debouncedSearch} // Pass the search term for highlighting
                            >
                                {/* Render Delete Button if the user has permission */}
                                {(user?.role === "admin" || user?.role === "usuario") && (
                                    <SimpleButton
                                        btnTitle="Deletar"
                                        func={() => openModal(apostador.id)}
                                        isSelected={false}
                                        className={styles.deleteButton}
                                    />
                                )}
                            </IconCard>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className={styles.pagination}>
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        Próxima
                    </button>
                </div>

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    onConfirm={confirmDelete}
                    message="Tem certeza que deseja deletar este apostador?"
                />
            </main>
        </>
    );
};

export default ApostadoresPage;
