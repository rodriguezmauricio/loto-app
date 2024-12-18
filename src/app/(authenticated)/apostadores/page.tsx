// src/app/(authenticated)/apostadores/page.tsx

"use client";

import PageHeader from "components/pageHeader/PageHeader";
import IconCard from "components/iconCard/IconCard";
import styles from "./apostadores.module.scss";
import { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useUserStore } from "../../../../store/useUserStore";
import { useDataStore } from "../../../../store/useDataStore"; // Import the new store
import { BsSearch, BsXLg } from "react-icons/bs";
import ConfirmModal from "components/confirmModal/ConfirmModal";
import { Apostador } from "../../../types/apostador"; // Ensure correct path

const ApostadoresPage = () => {
    const user = useUserStore((state) => state.user);

    const {
        apostadores,
        loading,
        error,
        fetchApostadores,
        deleteApostador,
        totalPages,
        currentPage,
    } = useDataStore();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("name_asc");
    const [page, setPage] = useState<number>(1); // Local page state if needed

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on new search
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        // Fetch apostadores whenever search, sort, or page changes
        fetchApostadores(debouncedSearch, sortOption, page).then(() => {
            console.log("Apostadores fetched:", apostadores);
        });
    }, [debouncedSearch, sortOption, page, fetchApostadores]);

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
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
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
        console.log(`Confirming deletion of apostador ID: ${apostadorToDelete}`);
        await deleteApostador(apostadorToDelete);
        closeModal();
    };

    console.log("Current apostadores:", apostadores);

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
                                linkTo={`/apostadores/${apostador.id}`}
                                isClickable={true}
                                extraInfo={`Criado em: ${new Date(
                                    apostador.created_on
                                ).toLocaleDateString()}`}
                                searchTerm={debouncedSearch} // Pass the search term for highlighting
                            >
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
                        disabled={page === 1}
                        className={styles.paginationButton}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
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
