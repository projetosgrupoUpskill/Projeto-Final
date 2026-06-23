import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import styles from "./styles/Summary.module.css";
import { FiEye, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import  useAuth from "../context/AuthContext";

export default function Summary({ balance, income, expense, showGreeting = true }) {
  const { currency} = useContext(PreferencesContext);
  const { userName } = useAuth();

  const formatCurrency = (value) => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT'

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div className={styles.summaryGrid}>
      {showGreeting && userName && (
        <h2
          style={{
            gridColumn: "1 / -1",
            marginBottom: "10px",
            color: "var(--text-h)",
            textAlign: "left",
            fontSize: "1.1rem",
          }}
        >
          Olá, {userName}!
        </h2>
      )}

      {/* Card de Saldo */}
      <div
        className={`${styles.card} ${styles.balanceCard}`}
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
        />
      </div>

      {/* Card de Receitas */}
      <div
        className={`${styles.card} ${styles.incomeCard}`}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Total de Receitas</h3>
        </div>
        <p className={`${styles.value} ${styles.incomeValue}`}>
          {formatCurrency(income)}
        </p>
        <FiTrendingUp
          size={18}
          strokeWidth={1.5}
          className={styles.eyeIcon}
        />
      </div>

      {/* Card de Despesas */}
      <div
        className={`${styles.card} ${styles.expenseCard}`}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Total de Despesas</h3>
        </div>
        <p className={`${styles.value} ${styles.expenseValue}`}>
          {formatCurrency(expense)}
        </p>
        <FiTrendingDown
          size={18}
          strokeWidth={1.5}
          className={styles.eyeIcon}
        />
      </div>
    </div>
  );
}