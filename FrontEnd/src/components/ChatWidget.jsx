import styles from "./styles/ChatWidget.module.css";
import { useState } from "react";

const suggestions = [
    "Resumo do mês",
    "Como economizar?",
    "Maior despesa",
    "Dicas financeiras",
  ];
  
  export default function ChatWidget() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
      { from: "bot", text: "Olá! Como posso ajudar? 👋" }
    ]);
  
    const handleSend = (text) => {
      if (!text.trim()) return;
      setMessages((prev) => [...prev, { from: "user", text }]);
      setInput("");
      // resposta do bot aqui futuramente
    };
  
    return (
      <div className={styles.chatWidget}>
        <div className={styles.chatHeader}>
          <h3>Assistente</h3>
          <p>Como posso ajudar?</p>
        </div>
  
        <div className={styles.chatMessages}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.from === "bot" ? styles.chatBubble : styles.chatBubbleUser}>
              {msg.text}
            </div>
          ))}
        </div>
  
        {/* Sugestões */}
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <button key={s} className={styles.suggestionChip} onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>
  
        <div className={styles.chatInputArea}>
          <input
            type="text"
            placeholder="Escreve uma mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          />
          <button onClick={() => handleSend(input)}>➤</button>
        </div>
      </div>
    );
  }