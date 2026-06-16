import { Link } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "../components/styles/AuthLayout.module.css";
import logo_atualizada from "../assets/logo_atualizada.svg";
import logo_dark_atualizada from "../assets/logo_dark_atualizada.svg";

export function AuthLayout({ 
    subtitle,
    footer,
    children
 }) {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={styles.container}>
            {/* Adicione o botão/link de voltar aqui, no topo do cartão */}
            <Link to="/" className={styles.backButton}>
                <FiArrowLeft size={20} /> 
                Voltar
            </Link>
            <div className={styles.card}>
                <div className={styles.header}>
                    <img
                        src={theme === "dark" ? logo_dark_atualizada : logo_atualizada}
                        alt="Money Hub Logo"
                        className={styles.logo}
                    />

                    <p className={styles.subtitle}>{subtitle}</p>
                </div>

                {children}

                <div className={styles.footer}>{footer}</div>
            </div>
        </div>
    )
}