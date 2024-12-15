import React from "react";
import styles from "./LoadingSpinner.module.scss";
const LoadingSpinner = () => {
    return (
        <div className={styles.loading}>
            <svg
                className={styles.spinner}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className={styles.opacity25}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className={styles.opacity75}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                ></path>
            </svg>
            <span>Carregando...</span>
        </div>
    );
};

export default LoadingSpinner;
