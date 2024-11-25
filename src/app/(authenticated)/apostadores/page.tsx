// app/pages/apostadores/page.tsx (Adjust the path as necessary)

"use client";

import PageHeader from "components/pageHeader/PageHeader";
import IconCard from "components/iconCard/IconCard";
import styles from "./apostadores.module.css";
import { useEffect, useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useUserStore } from "../../../../store/useUserStore";
import { BsSearch, BsXLg } from "react-icons/bs";

interface Apostador {
    id: string;
    username: string;
    phone: string;
    pix: string;
    created_on: string; // ISO date string
}

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

    // Manage current page for pagination (if implemented)
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
                    )}&sortField=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&limit=10`,
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

                const data: Apostador[] = await response.json();
                setApostadores(data);

                // Optionally, set totalPages based on headers or additional API response
                // Example:
                // const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
                // setTotalPages(Math.ceil(totalCount / 10));
            } catch (err: any) {
                console.error("Error fetching apostadores:", err);
                setError(err.message || "Erro ao buscar apostadores.");
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

    // Pagination handlers (if implemented)
    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

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
                            />
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
                    <span>Página {currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        // Disable based on totalPages if available
                        className={styles.paginationButton}
                    >
                        Próxima
                    </button>
                </div>
            </main>
        </>
    );
};

export default ApostadoresPage;
