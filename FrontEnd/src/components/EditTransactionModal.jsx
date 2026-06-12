import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "../api";
import TransactionForm from "./TransactionForm";
import modalStyles from "../components/styles/EditTransactionModal.module.css";

export default function EditTransactionModal({ transaction, onClose }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            onClose();
        },
        onError: () => {
            alert("Erro ao editar transação. Tente novamente.");
        },
    });

    const handleSubmit = ({ description, amount, category }) => {
        mutation.mutate({
            id: transaction.id,
            data: { description, amount, category, date: transaction.date },
        });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const initialValues = {
        description: transaction.description || "",
        amount: String(Math.abs(transaction.amount)) || "",
        type: transaction.amount >= 0 ? "income" : "expense",
        category: transaction.category || "outro",
    };

    return createPortal(
        <div className={modalStyles.overlay} onClick={handleOverlayClick}>
            <div className={modalStyles.modal} role="dialog" aria-modal="true" aria-label="Editar transação">

                <div className={modalStyles.modalHeader}>
                    <h2 className={modalStyles.modalTitle}>Editar Transação</h2>
                    <button className={modalStyles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
                </div>

                <div className={modalStyles.modalBody}>
                    <TransactionForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitLabel="Guardar alterações"
                        isPending={mutation.isPending}
                    />
                </div>

            </div>
        </div>,
        document.body
    );
}