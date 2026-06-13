import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";

 
export default function LandingPage() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          Controla as tuas finanças,
          <br />
          <strong>sem complicações.</strong>
        </h1>
 
        <p className={styles.subtitle}>
          A app inteligente que simplifica o teu orçamento e gere os teus
          gastos num só lugar.
        </p>
 
        <div className={styles.btnGroup}>
          <Link to="/register" className={styles.btnPrimary}>
            Registrar-se
          </Link>
          <Link to="/login" className={styles.btnSecondary}>
            Iniciar Sessão
          </Link>
        </div>
      </div>
 
      <div className={styles.right}>
        {/*
          IMAGEM ÚNICA — mockup combinado (MacBook + iPhone)
          Coloca o ficheiro em: src/assets/mockup-devices.png
          Tamanho recomendado: ~1100x650px
        */}
        <img
          src="/src/assets/mockup-devices.png"
          alt="Dashboard Money Hub no computador e no telemóvel"
          className={styles.imgDevices}
        />
      </div>
    </section>
  );
}