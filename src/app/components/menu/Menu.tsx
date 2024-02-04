"use client";
import Link from "next/link";
import logo from "../../../../public/images/lotoplay_light_logo.svg";

import styles from "./menu.module.css";
import {
  menuLinksHome,
  menuLinksPremios,
  menuLinksSettings,
  menuLinksSorteios,
} from "./menuLinks/menuLinks";
import { BsList, BsXLg } from "react-icons/bs";
import { useEffect, useState } from "react";
import Image from "next/image";

const Menu = () => {
  const [toggleMenu, setToggleMenu] = useState(true);
  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  return (
    <div className={styles.sticky}>
      <header className={styles.logoMenuContainer}>
        <div className={styles.logo}>
          <Image src={logo} alt="logo" width={130} height={50} />
        </div>
        <div className={styles.mobileMenuContainer} onClick={handleToggleMenu}>
          {toggleMenu ? <BsList size={35} /> : <BsXLg size={35} />}
        </div>
      </header>

      <nav
        className={
          toggleMenu ? `${styles.navContainer} ${styles.hideOnSmallScreen}` : styles.navContainer
        }
      >
        <div className={styles.menuDivisions}>
          {menuLinksHome.map((item) => {
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
          {menuLinksSorteios.map((item) => {
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
          {menuLinksPremios.map((item) => {
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
          {menuLinksSettings.map((item) => {
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
