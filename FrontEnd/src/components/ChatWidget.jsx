import styles from "./styles/ChatWidget.module.css";
import useAuth from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const suggestions = [
  "Resumo do mês",
  "Como economizar?",
  "Maior despesa",
  "Dicas financeiras",
];

export default function ChatWidget() {
  const { token } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Como posso ajudar? 👋" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.history?.length > 0) {
          setMessages(
            data.history.map((msg) => ({
              from: msg.role === "model" ? "bot" : "user",
              text: msg.content,
            })),
          );
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Prepara histórico para o backend
    const history = messages.map((msg) => ({
      role: msg.from === "bot" ? "model" : "user",
      content: msg.text,
    }));

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      // Lê o stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
      }

      // Quando o stream termina, processa o JSON completo
      const parsed = JSON.parse(fullText);

      if (parsed.action === "REPORT") {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: parsed.report.message,
            report: parsed.report,
          },
        ]);
      } else if (parsed.action === "SUGGESTION") {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: parsed.suggestion.message,
            items: parsed.suggestion.items,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: parsed.message,
          },
        ]);
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ocorreu um erro. Tenta novamente." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatWidget}>
      <div className={styles.chatMessages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.from === "bot" ? styles.chatBubble : styles.chatBubbleUser
            }
          >
            {msg.text}

            {/* Lista de sugestões do SUGGESTION */}
            {msg.items && (
              <ul>
                {msg.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}

            {/* Botão de download PDF do REPORT */}
            {msg.report && (
              <div>
              <button className={styles.pdfBtn}onClick={() => console.log("gerar PDF", msg.report)}>
                Download PDF
              </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className={styles.chatBubble}>
            <span className={styles.typingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões */}
      <div className={styles.suggestions}>
        {suggestions.map((s) => (
          <button
            key={s}
            className={styles.suggestionChip}
            onClick={() => handleSend(s)}
          >
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
