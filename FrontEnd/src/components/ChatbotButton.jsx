import { MessageCircleMore, X } from "lucide-react";
import styles from "./styles/ChatbotButton.module.css";

export default function ChatbotButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.chatbotBtn} ${isOpen ? styles.open : ""}`}
      aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
    >
      {isOpen ? <X size={24} /> : <MessageCircleMore size={24} />}
    </button>
  );
}