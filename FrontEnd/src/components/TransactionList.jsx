import TransactionItem from "./TransactionItem.jsx";
import styles from "./styles/TransactionList.module.css";
import Card from "./Card.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useContext } from "react";

export default function TransactionList({ transactions, onDelete, categoryFilterComponent, dateFilterComponent }) {

  const { theme } = useContext(ThemeContext);
  
  const sortedTransactions = [...transactions].sort((a, b) => { 
    return new Date(b.date) - new Date(a.date);
  });
  
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
            <div className={`${styles.headerCell} ${styles.headerDescription}`}>Descrição</div>
            <div className={`${styles.headerCell} ${styles.headerDate}`}>Data</div>
            <div className={`${styles.headerCell} ${styles.headerAmount}`}>Valor</div>
            <div className={`${styles.headerCell} ${styles.headerActions}`}>Ações</div>
          </div>

          <div className={`${styles.scrollArea} ${theme === "dark" ? styles.scrollAreaDark : styles.scrollAreaLight}`}>
            {sortedTransactions.map((t, index) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onDelete={onDelete}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </>
      )}
       </Card>
    </div>
  );
}