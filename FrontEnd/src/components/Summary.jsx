import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import styles from "./styles/Summary.module.css";
import { FiEye } from "react-icons/fi";

export default function Summary({ balance, income, expense, onCardClick }) {
  const { currency, userName } = useContext(PreferencesContext);

  const formatCurrency = (value) => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT'

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div className={styles.summaryGrid}>
      {userName && (
        <h2
          style={{
            gridColumn: "1 / -1",
            marginBottom: "10px",
            color: "var(--text-h)",
            textAlign: "left",
          }}
        >
          Olá, {userName}!
        </h2>
      )}

      {/* Card de Saldo */}
      <div
        className={`${styles.card} ${styles.balanceCard}`}
        onClick={() => onCardClick("all")}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Saldo Atual</h3>
        </div>
        <p
          className={`${styles.value} ${balance >= 0 ? styles.balancePositive : styles.balanceNegative}`}
        >
          {formatCurrency(balance)}
        </p>
        <FiEye
          size={18}
          strokeWidth={1.5}
          className={styles.eyeIcon}
          title="Remover Filtros"
        />
      </div>

      {/* Card de Receitas */}
      <div
        className={`${styles.card} ${styles.incomeCard}`}
        onClick={() => onCardClick("income")}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Total de Receitas</h3>
        </div>
        <p className={`${styles.value} ${styles.incomeValue}`}>
          {formatCurrency(income)}
        </p>
        <FiEye
          size={18}
          strokeWidth={1.5}
          className={styles.eyeIcon}
          title="Filtrar Receitas"
        />
      </div>

      {/* Card de Despesas */}
      <div
        className={`${styles.card} ${styles.expenseCard}`}
        onClick={() => onCardClick("expense")}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Total de Despesas</h3>
        </div>
        <p className={`${styles.value} ${styles.expenseValue}`}>
          {formatCurrency(expense)}
        </p>
        <FiEye
          size={18}
          strokeWidth={1.5}
          className={styles.eyeIcon}
          title="Filtrar Despesas"
        />
      </div>
    </div>
  );
}
