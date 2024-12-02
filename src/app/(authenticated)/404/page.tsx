// src/app/(authenticated)/404/page.tsx

import React from "react";
import Link from "next/link";
import { ROUTES } from "@routes/routes";
import PageHeader from "components/pageHeader/PageHeader";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumbs";
import styles from "./404.module.scss";

const Custom404: React.FC = () => {
    const breadcrumbs = [{ href: ROUTES.HOME, label: "Home" }];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <PageHeader title="Page Not Found" subpage={false} linkTo={ROUTES.HOME} />
            <main className={styles.main}>
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <Link href={ROUTES.HOME}>
                    <a className={styles.link}>Go back home</a>
                </Link>
            </main>
        </div>
    );
};

export default Custom404;
