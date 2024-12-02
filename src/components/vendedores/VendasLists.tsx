// src/components/Vendedores/VendasList.tsx

import React from "react";
import styles from "./VendasLists.module.scss";

interface Venda {
    id: string;
    product: string;
    amount: number;
    date: string;
    // Add other relevant fields
}

interface VendasListProps {
    vendas: Venda[];
}

const VendasList: React.FC<VendasListProps> = ({ vendas }) => {
    return (
        <ul className={styles.list}>
            {vendas.map((venda) => (
                <li key={venda.id} className={styles.listItem}>
                    <h3>{venda.product}</h3>
                    <p>Amount: ${venda.amount}</p>
                    <p>Date: {venda.date}</p>
                    {/* Add more venda details or actions as needed */}
                </li>
            ))}
        </ul>
    );
};

export default VendasList;
