// src/app/(authenticated)/users/[userId]/edit/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import UserEditForm from "components/users/UserEditform";
import { User } from "../../../../../types/user";
import { Role } from "../../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";
import { ROUTES } from "@routes/routes";
import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./EditUserPage.module.scss";

interface EditUserPageProps {
    params: { userId: string };
}

const EditUserPage: React.FC<EditUserPageProps> = ({ params }) => {
    const { userId } = params;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the user data from the API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Usuário não encontrado.");
                    } else {
                        const errorData = await res.json();
                        setError(errorData.error || "Erro ao buscar usuário.");
                    }
                    setLoading(false);
                    return;
                }

                const data: User = await res.json();
                setUser(data);
            } catch (err: any) {
                console.error("Error fetching user:", err);
                setError("Erro ao buscar usuário.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    // Fetch currentUserRole (replace with actual authentication logic)
    // Assuming you have a way to get the current user's role, e.g., via context or props
    const currentUserRole: Role = "admin"; // Example role

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.USERS, label: "Usuários" },
        { href: ROUTES.USER(userId), label: `Usuário ${userId}` },
        { href: ROUTES.EDIT_USER(userId), label: "Editar Usuário" },
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <PageHeader title="Editar Usuário" subpage={false} linkTo={ROUTES.USERS} />
                <p className={styles.p}>Carregando usuário...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <PageHeader title="Editar Usuário" subpage={false} linkTo={ROUTES.USERS} />
                <p className={styles.p}>{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <PageHeader title="Editar Usuário" subpage={false} linkTo={ROUTES.USERS} />
                <p className={styles.p}>Usuário não encontrado.</p>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <div className={styles.container}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <PageHeader title="Editar Usuário" subpage={true} linkTo={ROUTES.USER(user.id)} />
                <UserEditForm user={user} />
            </div>
        </ProtectedRoute>
    );
};

export default EditUserPage;
