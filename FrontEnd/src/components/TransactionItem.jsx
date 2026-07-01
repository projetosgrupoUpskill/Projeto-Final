import { FiTrash, FiEdit2, FiMoreVertical } from "react-icons/fi";
import styles from "./styles/TransactionItem.module.css";
import { useContext, useState, useEffect, useRef } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import EditTransactionModal from "./EditTransactionModal";
import ConfirmModal from "../components/ConfirmModal";

export default function TransactionItem({ transaction, onDelete, isEven, showActions = true }) {

    const isIncome = transaction.type === "income";
    const { currency } = useContext(PreferencesContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Fecha o menu se clicar fora dele
    useEffect(() => {
        if (!menuOpen) return;
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const formatCurrency = (amount) => {
        const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT';
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

            {/* Ações — botões normais em desktop, menu ⋮ em mobile */}
            {showActions && (
                <div className={styles.actions}>
                    {/* Botões normais — visíveis só em desktop (via CSS) */}
                    <button
                        className={`${styles.editButton} ${styles.desktopOnly}`}
                        onClick={() => setIsEditing(true)}
                        title="Editar transação"
                    >
                        <FiEdit2 className={styles.icon} />
                    </button>
                    <button
                        className={`${styles.deleteButton} ${styles.desktopOnly}`}
                        onClick={() => setIsDeleting(true)}
                        title="Eliminar Transação"
                    >
                        <FiTrash className={styles.icon} />
                    </button>

                    {/* Menu ⋮ — visível só em mobile (via CSS) */}
                    <div className={`${styles.moreMenu} ${styles.mobileOnly}`} ref={menuRef}>
                        <button
                            className={styles.moreButton}
                            onClick={() => setMenuOpen((o) => !o)}
                            title="Mais opções"
                        >
                            <FiMoreVertical className={styles.icon} />
                        </button>
                        {menuOpen && (
                            <div className={styles.dropdown}>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                                >
                                    <FiEdit2 className={styles.dropdownIcon} />
                                    Editar
                                </button>
                                <button
                                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                                    onClick={() => { setIsDeleting(true); setMenuOpen(false); }}
                                >
                                    <FiTrash className={styles.dropdownIcon} />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {isEditing && (
            <EditTransactionModal
                transaction={transaction}
                onClose={() => setIsEditing(false)}
            />
        )}
        <ConfirmModal
            isOpen={isDeleting}
            title="Eliminar transação"
            message={<>Tens a certeza que queres eliminar <strong>{transaction.title}</strong>?</>}
            subMessage="Esta ação não pode ser desfeita."
            confirmLabel="Eliminar"
            onConfirm={() => { onDelete(transaction.id); setIsDeleting(false); }}
            onCancel={() => setIsDeleting(false)}
        />
        </>
    );
}