import { useAuth } from "../context/AuthContext";
import { FiGithub } from "react-icons/fi";
import { contacts } from "../pages/Contact"; // ADICIONADO
import styles from "./styles/Footer.module.css";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {currentYear} Money Hub. Todos os direitos reservados.
      </p>

      {isAuthenticated && (
        <div className={styles.devs}>
          <span className={styles.text}> <strong>Desenvolvido por:</strong></span>
          {contacts.map((contact, index) => (
            <span key={contact.id} className={styles.devItem}>
              {" "}
              {/* ADICIONADO */}
              {index > 0 && <span className={styles.separator}>&</span>}{" "}
              {/* ADICIONADO */}
              <a
                href={contact.gitHubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.devLink}
              >
                <FiGithub size={16} /> {contact.name}
              </a>
            </span>
          ))}
        </div>
      )}
    </footer>
  );
}
