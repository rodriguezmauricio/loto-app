"use client";
import Link from "next/link";

import styles from "./menu.module.css";
import {
  menuLinksHome,
  menuLinksPremios,
  menuLinksSettings,
  menuLinksSorteios,
} from "./menuLinks/menuLinks";
import { BsList, BsXLg } from "react-icons/bs";
import { useEffect, useState } from "react";

const Menu = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  // State to store the screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Function to handle screen width changes
  const handleScreenWidth = () => {
    setScreenWidth(window.innerWidth);
    // Your additional logic based on screen width can go here
  };

  // Effect to run on component mount and window resize
  useEffect(() => {
    // Attach the function to the window resize event
    window.addEventListener("resize", handleScreenWidth);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleScreenWidth);
    };

    // No dependencies for this effect, so it runs only on mount and unmount
  }, []);

  return (
    <div className={styles.sticky}>
      <header className={styles.logoMenuContainer}>
        <div className={styles.logo}>
          <h1>LottoApp</h1>
        </div>
        <div className={styles.mobileMenuContainer} onClick={handleToggleMenu}>
          {toggleMenu ? <BsList size={35} /> : <BsXLg size={35} />}
        </div>
      </header>

      <nav
        className={
          toggleMenu && screenWidth < 768
            ? `${styles.navContainer} ${styles.hide}`
            : styles.navContainer
        }
      >
        <div className={styles.menuDivisions}>
          {menuLinksHome.map((item) => {
            return (
              <Link href={item.href} key={item.linkName} className={styles.menuLink}>
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
              <Link href={item.href} key={item.linkName} className={styles.menuLink}>
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
              <Link href={item.href} key={item.linkName} className={styles.menuLink}>
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
              <Link href={item.href} key={item.linkName} className={styles.menuLink}>
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
