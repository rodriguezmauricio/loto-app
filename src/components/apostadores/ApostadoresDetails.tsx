// src/components/Apostadores/ApostadorDetails.tsx

import React from "react";
import Link from "next/link";
import { ROUTES } from "@routes/routes";
import PageHeader from "../pageHeader/PageHeader";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import styles from "./ApostadorDetails.module.scss";

interface Apostador {
    id: string;
    name: string;
    // Add other relevant fields
}

interface ApostadorDetailsProps {
    apostador: Apostador;
}

const ApostadorDetails: React.FC<ApostadorDetailsProps> = ({ apostador }) => {
    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.APOSTADORES, label: "Apostadores" },
        { href: ROUTES.APOSTADOR(apostador.id), label: `Apostador ${apostador.id}` },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <PageHeader
                title="Apostador Details"
                subpage={true}
                linkTo="APOSTADORES" // Links back to Apostadores list
            />
            <div className={styles.details}>
                <h2>{apostador.name}</h2>
                {/* Display other apostador details */}
                <Link href={ROUTES.APOSTADOR_APOSTAS(apostador.id)} className={styles.link}>
                    View Apostas
                </Link>
            </div>
        </div>
    );
};

export default ApostadorDetails;
