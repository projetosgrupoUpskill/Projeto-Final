import styles from "./styles/Card.module.css";

export default function Card({ title, children }) {
  return (
    <div className={styles.cardContainer}>
      {title && (
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
      )}
      <div className={styles.cardBody}>
        {children}
      </div>
    </div>
  );
}