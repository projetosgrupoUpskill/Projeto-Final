import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../api";
import TransactionForm from "../components/TransactionForm";
import styles from "../components/styles/AddTransaction.module.css";
import { ThemeContext } from "../context/ThemeContext";
import { FiPlus, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddTransaction() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação criada com sucesso!");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar transação. Tente novamente.");
    },
  });

  const handleSubmit = ({ description, amount, category, date, type }) => {
    mutation.mutate({
      title: description,
      amount: Math.abs(Number(amount)),
      type: type,
      transaction_date: new Date(date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      category_id: category,
      currency_id: 1,
    });
  };

  return (
    <div
      className={`${styles.accordion} ${isDark ? styles.accordionDark : ""}`}
    >
      <button
        type="button"
        className={`${styles.accordionHeader} ${isDark ? styles.accordionHeaderDark : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionHeaderLeft}>
          {isOpen ? (
            <FiX
              className={`${styles.accordionIcon} ${isDark ? styles.accordionIconDark : ""}`}
            />
          ) : (
            <FiPlus
              className={`${styles.accordionIcon} ${isDark ? styles.accordionIconDark : ""}`}
            />
          )}
          Adicionar Transação
        </span>
        {isOpen ? (
          <FiChevronUp
            className={`${styles.chevron} ${isDark ? styles.chevronDark : ""}`}
          />
        ) : (
          <FiChevronDown
            className={`${styles.chevron} ${isDark ? styles.chevronDark : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <div className={styles.cardBody}>
          <TransactionForm
            onSubmit={handleSubmit}
            submitLabel="Adicionar"
            isPending={mutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
