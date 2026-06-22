import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./styles/Header.module.css";
import logo_atualizada from "../assets/logo_atualizada.svg";
import logo_dark_atualizada from "../assets/logo_dark_atualizada.svg";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ADICIONADO
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout } = useAuth(); // ALTERADO: adicionado isAuthenticated
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = (path) =>
    `${styles.navLink} ${location.pathname === path ? styles.navLinkActive : ""}`;

  const handleLogout = () => {
    logout();
    navigate("/"); // ALTERADO: redireciona para "/" após logout
  };

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
      <button
        className={`${styles.menuBtn} ${isMenuOpen ? styles.menuBtnOpen : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Links de navegação com classe condicional baseada no estado */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        {/* ADICIONADO: bloco condicional */}
        {isAuthenticated ? (
          <>
            <Link to="/painel" className={linkClass("/painel")}>
              Painel
            </Link>
            <Link to="/details" className={linkClass("/details")}>
              Transações
            </Link>
            <Link to="/settings" className={linkClass("/settings")}>
              Definições
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.navLink} ${styles.loginLink}`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/about" className={linkClass("/about")}>
              Sobre Nós
            </Link>
            <Link
              to="/login"
              className={`${styles.navLink} ${styles.loginLink}`}
            >
              Login
            </Link>
          </>
        )}

        <button
          onClick={toggleTheme}
          className={styles.themeToggleBtn}
          title={
            theme === "dark"
              ? "Mudar para Modo Claro"
              : "Mudar para Modo Escuro"
          }
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </nav>
    </header>
  );
}

