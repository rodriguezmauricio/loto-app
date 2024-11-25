// /components/ConfirmModal.tsx

import React from "react";
import Modal from "react-modal";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import styles from "./ConfirmModal.module.scss"; // Create and style as needed

interface ConfirmModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onRequestClose,
    onConfirm,
    message,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmação"
            className={styles.modal}
            overlayClassName={styles.overlay}
            ariaHideApp={false} // Set to true and bind to your app element in production
        >
            <h2>Confirmação</h2>
            <p>{message}</p>
            <div className={styles.buttons}>
                <SimpleButton btnTitle="Cancelar" func={onRequestClose} isSelected={false} />
                <SimpleButton btnTitle="Confirmar" func={onConfirm} isSelected={false} />
            </div>
        </Modal>
    );
};

export default ConfirmModal;
