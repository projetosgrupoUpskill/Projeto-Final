import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "../components/styles/LandingPage.module.css";

export default function LandingPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          Controle suas finanças,
          <br />
          <strong>sem complicações.</strong>
        </h1>

        <p className={styles.subtitle}>
          A app inteligente que simplifica o teu orçamento e gere os teus
          gastos num só lugar.
        </p>

        <div className={styles.btnGroup}>
          <Link to="/cadastro" className={styles.btnPrimary}>
            Registrar-se
          </Link>
          <Link to="/login" className={styles.btnSecondary}>
            Iniciar Sessão
          </Link>
        </div>
      </div>

      <div className={styles.right}>
        <img
          src={theme === "dark" ? "/src/assets/mock_dark.svg" : "/src/assets/mock_light.svg"}
          alt="Dashboard Money Hub no computador e no telemóvel"
          className={styles.imgDevices}
        />
      </div>
    </section>
  );
}