// components/Modal.tsx
"use client";
import React, { useEffect } from "react";
import styles from "./Modal.module.scss"; // Use SCSS
import { FiX } from "react-icons/fi"; // Import an icon for the close button

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        // Prevent closing the modal when clicking inside the content
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Disable background scrolling when modal is open
    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            // Re-enable scrolling when modal is closed
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    <FiX size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
