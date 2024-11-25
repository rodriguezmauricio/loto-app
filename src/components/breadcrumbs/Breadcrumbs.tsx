// src/components/Breadcrumbs/Breadcrumbs.tsx

import React from "react";
import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    breadcrumbs: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    return (
        <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
            <ol className={styles.breadcrumbList}>
                {breadcrumbs.map((crumb, index) => {
                    console.log("crumb:", crumb);
                    return (
                        <li key={index} className={styles.breadcrumbItem}>
                            {index < breadcrumbs.length - 1 ? (
                                <Link href={crumb.href} className={styles.breadcrumbLink}>
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className={styles.currentCrumb}>{crumb.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
