import { createPortal } from "react-dom";
import styles from "./styles/ConfirmModal.module.css";

export default function ConfirmModal({
    isOpen,
    title,
    message,
    subMessage,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className={styles.overlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div className={styles.confirmModal}>
                <h3 className={styles.confirmTitle}>{title}</h3>
                <p className={styles.confirmText}>{message}</p>
                {subMessage && <p className={styles.confirmText}>{subMessage}</p>}
                <div className={styles.confirmActions}>
                    <button className={styles.cancelConfirmBtn} onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className={styles.deleteConfirmBtn} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}