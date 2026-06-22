import { FiTrash, FiEdit2 } from "react-icons/fi";
import styles from "./styles/TransactionItem.module.css";
import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import { useState } from "react";
import EditTransactionModal from "../components/EditTransactionModal";
import { createPortal } from "react-dom";

export default function TransactionItem({ transaction, onDelete, isEven, showActions = true }) {

    const isIncome = transaction.type === "income";
    const { currency } = useContext(PreferencesContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatCurrency = (amount) => {
        const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT'

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency || 'EUR',

            signDisplay: 'always'
        }).format(amount);
    };

    return (
        <>
        <div className={`${styles.row} ${isEven ? styles.rowEven : styles.rowOdd}`}>
            {/* Descrição */}
            <div className={`${styles.description} ${!showActions ? styles.descriptionNoActions : ""}`}>
            {transaction.categoryIcon ? (
                <span
                    dangerouslySetInnerHTML={{ __html: transaction.categoryIcon }}
                    style={{ width: 20, height: 20, marginRight: 12, color: transaction.categoryColor, display: "flex", flexShrink: 0 }}
                />
            ) : (
                <div className={`${styles.indicator} ${isIncome ? styles.indicatorIncome : styles.indicatorExpense}`} />
            )}
                <span className={styles.descriptionText}>{transaction.title}</span>
            </div>

            {/* Data */}
            <div className={styles.date}>
                {new Date(transaction.transaction_date).toLocaleDateString("pt-PT")}
            </div>

            {/* Valor */}
            <div className={`${styles.amount} ${!showActions ? styles.amountNoActions : ""}`}>
                <span className={`${styles.amountValue} ${isIncome ? styles.amountIncome : styles.amountExpense}`}>
                    {formatCurrency(isIncome ? transaction.amount : -transaction.amount)}
                </span>
            </div>

            {/* Ações */}
            {showActions && (
                <div className={styles.actions}>
                    <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                            title="Editar transação"
                        >
                            <FiEdit2 className={styles.icon} />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => setIsDeleting(true)}
                        title="Eliminar Transação"
                    >
                        <FiTrash className={styles.icon} />
                    </button>
                </div>
            )}
        </div>
        {isEditing && (
            <EditTransactionModal
                transaction={transaction}
                onClose={() => setIsEditing(false)}
            />
        )}
        {isDeleting && createPortal(
            <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setIsDeleting(false); }}>
                <div className={styles.confirmModal}>
                    <h3 className={styles.confirmTitle}>Eliminar transação</h3>
                    <p className={styles.confirmText}>
                        Tens a certeza que queres eliminar <strong>{transaction.title}</strong>? 
                    </p>
                    <p className={styles.confirmText}>Esta ação não pode ser desfeita.</p>
                    <div className={styles.confirmActions}>
                        <button className={styles.cancelConfirmBtn} onClick={() => setIsDeleting(false)}>
                            Cancelar
                        </button>
                        <button className={styles.deleteConfirmBtn} onClick={() => { onDelete(transaction.id); setIsDeleting(false); }}>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}
        </>
    );
}