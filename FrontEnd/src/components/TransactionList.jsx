import TransactionItem from "./TransactionItem.jsx";
import styles from "./styles/TransactionList.module.css";
import Card from "./Card.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useContext } from "react";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 8;

export default function TransactionList({
  transactions,
  onDelete,
  categoryFilterComponent,
  dateFilterComponent,
  showPagination = true,
}) {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className={styles.container}>
      <Card title="Lista de Transacções">
        {sortedTransactions.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Ainda não há transacções.</p>
          </div>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <div
                className={`${styles.headerCell} ${styles.headerDescription}`}
              >
                Descrição
              </div>
              <div className={`${styles.headerCell} ${styles.headerDate}`}>
                Data
              </div>
              <div className={`${styles.headerCell} ${styles.headerAmount}`}>
                Valor
              </div>
              <div className={`${styles.headerCell} ${styles.headerActions}`}>
                Ações
              </div>
            </div>

            <div
              className={`${styles.scrollArea} ${theme === "dark" ? styles.scrollAreaDark : styles.scrollAreaLight}`}
            >
              {paginatedTransactions.map((t, index) => (
                
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  onDelete={onDelete}
                  isEven={index % 2 === 0}
                />
              ))}
            </div>

            {/* Paginação */}
            {showPagination && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                padding: "16px 0",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                ← Anterior
              </button>

              <span style={{ fontSize: 14 }}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "6px 12px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >
                Próxima →
              </button>
            </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
