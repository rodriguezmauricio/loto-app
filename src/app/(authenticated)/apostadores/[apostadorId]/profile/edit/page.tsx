// app/(authenticated)/apostadores/[apostadorId]/page.tsx

"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BilheteTable from "components/bilheteTable/BilheteTable";
import { User, Bilhete } from "../../../../../../types/roles"; // Ensure you have appropriate TypeScript types
import styles from "./editar.module.scss";

const ApostadorDetailPage = () => {
    const router = useRouter();
    const { apostadorId } = router.query;

    const [apostador, setApostador] = useState<User | null>(null);
    const [bilhetes, setBilhetes] = useState<Bilhete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!apostadorId) return;

        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`);
                const data = await response.json();

                if (response.ok) {
                    setApostador(data);
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

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!apostador) return <p>Apostador não encontrado.</p>;

    return (
        <div>
            <h1>{apostador.name || apostador.username}</h1>
            <p>Email: {apostador.email}</p>
            <p>Phone: {apostador.phone}</p>
            <p>PIX: {apostador.pix}</p>
            <p>Created On: {new Date(apostador.created_on).toLocaleDateString()}</p>
            {/* Other apostador details... */}

            <h2>Bilhetes</h2>
            <BilheteTable bilhetes={bilhetes} />
        </div>
    );
};

export default ApostadorDetailPage;
