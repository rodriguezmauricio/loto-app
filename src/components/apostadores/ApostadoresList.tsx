// src/components/Apostadores/ApostadoresList.tsx

import React from "react";
import Link from "next/link";
import { ROUTES } from "@routes/routes";
import styles from "./ApostadoresList.module.css";
import { Apostador } from "../../types/apostador";

interface ApostadoresListProps {
    apostadores: Apostador[];
}

const ApostadoresList: React.FC<ApostadoresListProps> = ({ apostadores }) => {
    return (
        <ul className={styles.list}>
            {apostadores.map((apostador) => (
                <li key={apostador.id} className={styles.listItem}>
                    <Link href={ROUTES.APOSTADOR(apostador.id)}>
                        <a>{apostador.name}</a>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ApostadoresList;
