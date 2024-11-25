"use client";

import { BsBoxArrowLeft } from "react-icons/bs";
import Title from "../title/Title";
import styles from "./pageHeader.module.scss";
import Link from "next/link";
import { Url } from "url";
import SubMenu from "../subMenu/SubMenu";
import { TsubmenuType } from "../subMenu/SubMenu";
import SearchBar from "../searchBar/SearchBar";
import { useRouter } from "next/navigation";

interface IHeader {
    title: string;
    subpage: boolean;
    linkTo: Url | string;
    hasSearch?: boolean;
    hasSubMenu?: boolean;
    submenuType?: TsubmenuType;
    submenuLink?: string;
    submenuFunction?: () => void;
}

const PageHeader = ({
    title,
    subpage,
    linkTo,
    hasSearch = false,
    hasSubMenu = false,
    submenuType,
    submenuLink,
    submenuFunction,
}: IHeader) => {
    const router = useRouter();

    // Handler for the "Go Back" button
    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            // Fallback to a default route, e.g., home page
            router.push("/");
        }
    };

    const renderSubmenu = () => {
        if (!submenuLink) {
            return (
                hasSubMenu &&
                submenuType &&
                submenuFunction && <SubMenu type={submenuType} submenuFunction={submenuFunction} />
            );
        } else {
            return (
                hasSubMenu &&
                submenuType &&
                submenuLink && <SubMenu type={submenuType} submenuLink={submenuLink} />
            );
        }
    };

    const renderSearchBar = () => {
        if (hasSearch) {
            return <SearchBar />;
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.row}>
                {subpage && (
                    <button
                        onClick={handleGoBack}
                        className={styles.button}
                        aria-label="Voltar à página anterior"
                    >
                        <BsBoxArrowLeft size={30} />
                    </button>
                )}
                <Title h={1}>{title}</Title>
            </div>
            <div>
                <div className={styles.user}>
                    {renderSearchBar()}
                    {renderSubmenu()}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
