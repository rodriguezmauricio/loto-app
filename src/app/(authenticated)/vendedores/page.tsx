// app/pages/vendedores/page.tsx

"use client";

import PageHeader from "components/pageHeader/PageHeader";
import IconCard from "components/iconCard/IconCard";
import styles from "./vendedores.module.scss"; // Ensure this CSS module exists
import { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useUserStore } from "../../../../store/useUserStore"; // Ensure correct path
import { BsSearch, BsXLg } from "react-icons/bs";
import ConfirmModal from "components/confirmModal/ConfirmModal";

interface Vendedor {
    id: string;
    username: string;
    phone: string;
    pix: string;
    created_on: string; // ISO date string
}

const VendedoresPage = () => {
    const user = useUserStore((state) => state.user);
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
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
        const fetchVendedores = async () => {
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
                    )}&role=vendedor&sortField=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&limit=10`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar vendedores.");
                }

                const data: Vendedor[] = await response.json();
                setVendedores(data);

                // Get totalPages from headers
                const totalPagesHeader = response.headers.get("X-Total-Pages");
                setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
            } catch (err: any) {
                console.error("Error fetching vendedores:", err);
                setError(err.message || "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchVendedores();
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
    const [vendedorToDelete, setVendedorToDelete] = useState<string | null>(null);

    const openModal = (id: string) => {
        setVendedorToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setVendedorToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!vendedorToDelete) return;

        try {
            const response = await fetch(`/api/users/${vendedorToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Remove the deleted vendedor from the state
                setVendedores(vendedores.filter((v) => v.id !== vendedorToDelete));
                alert("Vendedor deletado com sucesso.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao deletar vendedor.");
            }
        } catch (err: any) {
            console.error("Error deleting vendedor:", err);
            alert(err.message || "Erro desconhecido ao deletar vendedor.");
        } finally {
            closeModal();
        }
    };

    if (loading) {
        return (
            <>
                <PageHeader
                    title="Vendedores"
                    subpage={false}
                    linkTo={""}
                    hasSubMenu
                    submenuType="add"
                    submenuLink="/vendedores/novo"
                />
                <main className="main">
                    <p>Carregando vendedores...</p>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader
                    title="Vendedores"
                    subpage={false}
                    linkTo={""}
                    hasSubMenu
                    submenuType="add"
                    submenuLink="/vendedores/novo"
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
                title="Vendedores"
                subpage={false}
                linkTo={""}
                hasSubMenu
                submenuType="add"
                submenuLink="/vendedores/novo"
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

                {/* Vendedores List */}
                {vendedores.length === 0 ? (
                    <p>Nenhum vendedor encontrado.</p>
                ) : (
                    <div className={styles.cardContainer}>
                        {vendedores.map((vendedor) => (
                            <IconCard
                                key={vendedor.id}
                                title={vendedor.username}
                                description={`Telefone: ${vendedor.phone}`}
                                icon="user"
                                linkTo={`/vendedores/${vendedor.id}`} // Adjust the link as necessary
                                isClickable={true}
                                extraInfo={`Criado em: ${new Date(
                                    vendedor.created_on
                                ).toLocaleDateString()}`}
                                searchTerm={debouncedSearch} // Pass the search term for highlighting
                            >
                                {/* Render Delete Button if the user has permission */}
                                {(user?.role === "admin" || user?.role === "seller") && (
                                    <SimpleButton
                                        btnTitle="Deletar"
                                        func={() => openModal(vendedor.id)}
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
                    message="Tem certeza que deseja deletar este vendedor?"
                />
            </main>
        </>
    );
};

export default VendedoresPage;
