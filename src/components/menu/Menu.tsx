"use client";
import Link from "next/link";
import logo from "../../../public/images/lotoplay_light_logo.svg";

import styles from "./menu.module.scss";
import {
    menuLinksHome,
    menuLinksPremios,
    menuLinksSettings,
    menuLinksSorteios,
} from "./menuLinks/menuLinks";
import { BsList, BsXLg } from "react-icons/bs";
import { useState } from "react";
import Image from "next/image";
import { useUserStore } from "../../../store/useUserStore";

const Menu = () => {
    const user = useUserStore((state) => state.user);
    const [toggleMenu, setToggleMenu] = useState(true);
    const handleToggleMenu = () => {
        setToggleMenu((prev) => !prev);
    };

    const userRole = user?.role || "usuario";

    console.log("user: ", user);

    return (
        <div className={styles.sticky}>
            <header className={styles.logoMenuContainer}>
                <div className={styles.logo}>
                    <Image src={logo} alt="logo" width={130} height={50} />
                    <p>{user?.bancaName ?? "Nome da banca"}</p>
                </div>
                <div className={styles.mobileMenuContainer} onClick={handleToggleMenu}>
                    {toggleMenu ? <BsList size={35} /> : <BsXLg size={35} />}
                </div>
            </header>

            <nav
                className={
                    toggleMenu
                        ? `${styles.navContainer} ${styles.hideOnSmallScreen}`
                        : styles.navContainer
                }
            >
                <div className={styles.menuDivisions}>
                    {menuLinksHome
                        .filter((item) => item.roles.includes(userRole))
                        .map((item) => {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.linkName}
                                    className={styles.menuLink}
                                    onClick={handleToggleMenu}
                                >
                                    <div className={styles.icon}>{item.icon}</div>
                                    <span className={styles.linkText}>{item.linkName}</span>
                                </Link>
                            );
                        })}
                </div>
                <div className={styles.divider} />
                <div className={styles.menuDivisions}>
                    {menuLinksSorteios
                        .filter((item) => item.roles.includes(userRole))
                        .map((item) => {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.linkName}
                                    className={styles.menuLink}
                                    onClick={handleToggleMenu}
                                >
                                    <div className={styles.icon}>{item.icon}</div>
                                    <span className={styles.linkText}>{item.linkName}</span>
                                </Link>
                            );
                        })}
                </div>
                <div className={styles.divider} />
                <div className={styles.menuDivisions}>
                    {menuLinksPremios
                        .filter((item) => item.roles.includes(userRole))
                        .map((item) => {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.linkName}
                                    className={styles.menuLink}
                                    onClick={handleToggleMenu}
                                >
                                    <div className={styles.icon}>{item.icon}</div>
                                    <span className={styles.linkText}>{item.linkName}</span>
                                </Link>
                            );
                        })}
                </div>
                <div className={styles.divider} />
                <div className={styles.menuDivisions}>
                    {menuLinksSettings
                        .filter((item) => item.roles.includes(userRole))
                        .map((item) => {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.linkName}
                                    className={styles.menuLink}
                                    onClick={handleToggleMenu}
                                >
                                    <div className={styles.icon}>{item.icon}</div>
                                    <span className={styles.linkText}>{item.linkName}</span>
                                </Link>
                            );
                        })}
                </div>
            </nav>
        </div>
    );
};

export default Menu;
