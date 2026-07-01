import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "../api";
import TransactionForm from "./TransactionForm";
import modalStyles from "./styles/EditTransactionModal.module.css";
import toast from "react-hot-toast";

export default function EditTransactionModal({ transaction, onClose }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success ("Transação editada com sucesso!")
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao editar transação. Tente novamente.");
    },
  });

  const handleSubmit = ({ description, amount, category, date, type }) => {
    mutation.mutate({
      id: transaction.id,
      data: {
        title: description,
        amount: Math.abs(parseFloat(amount)),
        type: type,
        transaction_date: date.split("T")[0],
        category_id: category,
        currency_id: transaction.currency_id || 1,
      },
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const initialValues = {
    description: transaction.title || "",
    amount: String(Math.abs(transaction.amount)) || "",
    type: transaction.type || "expense",
    category: transaction.category_id || "",
    date: transaction.transaction_date 
    ? new Date(transaction.transaction_date).toLocaleDateString("en-CA")
    : new Date().toLocaleDateString("en-CA")
  };

  return createPortal(
    <div className={modalStyles.overlay} onClick={handleOverlayClick}>
      <div
        className={modalStyles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Editar transação"
      >
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.modalTitle}>Editar Transação</h2>
          <button
            className={modalStyles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
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
    document.body,
  );
}
