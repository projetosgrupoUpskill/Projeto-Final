import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";
import logo_atualizada from "../assets/logo_atualizada.svg";
import logo_dark_atualizada from "../assets/logo_dark_atualizada.svg";
import { useContext, useState } from "react"; 
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi"; // <-- Importe os ícones


export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* Ícone */}
      <div className={styles.logo}>
        <img
          src={theme === "dark" ? logo_dark_atualizada : logo_atualizada}
          alt="Money Hub"
          className={styles.logoImage}
        />
      </div>

      {/* Botão de Menu para telas menores */}
      <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Links de navegação com classe condicional baseada no estado */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        <Link to="/" className={styles.navLink}>
          Painel
        </Link>
        <Link to="/details" className={styles.navLink}>
          Detalhes
        </Link>
        <Link to="/about" className={styles.navLink}>
          Sobre Nós
        </Link>
        <Link to="/settings" className={styles.navLink}>
          Definições
        </Link>
        <Link to="/login" className={`${styles.navLink} ${styles.loginLink}`}>
          Login
        </Link>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggleBtn}
          title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </nav>
    </header>
  );
}