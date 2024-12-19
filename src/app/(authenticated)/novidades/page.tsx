"use client";

import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import styles from "./NovidadesPage.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import ProtectedRoute from "components/ProtectedRoute";
import React from "react";
import { ROUTES } from "@routes/routes";
import { useUserStore } from "../../../../store/useUserStore";
import { novidadesData } from "./novidadesData";
import NovidadesCard from "components/novidadesCard/NovidadesCard";

const NovidadesPage = () => {
    const user = useUserStore((state) => state.user);

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.NOVIDADES, label: "Novidades" },
    ];

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={user?.role}>
            <PageHeader title="Novidades" subpage={false} linkTo={""} />
            <main>
                <div className={styles.container}>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    {novidadesData.map((item) => {
                        return (
                            <NovidadesCard key={item.id} date={item.date} content={item.content} />
                        );
                    })}
                </div>
            </main>
        </ProtectedRoute>
    );
};

export default NovidadesPage;
