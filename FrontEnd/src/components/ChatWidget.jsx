import styles from "./styles/ChatWidget.module.css";
import useAuth from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { FiDownload, FiTrash2, FiMessageCircle, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import ConfirmModal from "./ConfirmModal";
import API_URL, { clearChatHistory } from "../api";
import { downloadReportPDF } from "./PDFCreator";

const suggestions = [
  "Resumo do mês",
  "Como economizar?",
  "Maior despesa",
  "Dicas financeiras",
];

const GREETING = { from: "bot", text: "Olá! Como posso ajudar? 👋" };

// A IA sempre responde com um JSON ({ action, message/report/suggestion }).
// Como cada action só preenche um desses 3 campos, o encadeamento com ??
// já pega o que existir, sem precisar de if/else por action.
function parseAssistantMessage(rawContent) {
  try {
    const parsed = JSON.parse(rawContent);
    return {
      text:
        parsed.message ??
        parsed.report?.message ??
        parsed.suggestion?.message ??
        rawContent,
      items: parsed.suggestion?.items,
      report: parsed.report,
    };
  } catch {
    // Não era JSON (ex: mensagem antiga, ou texto de erro já tratado).
    return { text: rawContent };
  }
}

export default function ChatWidget() {
  const { token } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([GREETING]);

  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.history?.length > 0) {
          setMessages(
            data.history.map((msg) => {
              if (msg.role === "model") {
                return { from: "bot", ...parseAssistantMessage(msg.content) };
              }
              return { from: "user", text: msg.content };
            }),
          );
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };

    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await clearChatHistory();
      setMessages([GREETING]);
    } catch (err) {
      console.error("Erro ao limpar histórico:", err);
    } finally {
      setIsClearing(false);
    }
  };

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
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error || "Erro ao processar mensagem");
      }

      // Adiciona bolha do bot vazia para ir preenchendo
      setMessages((prev) => [...prev, { from: "bot", text: "" }]);

      // Lê o stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        // Atualiza a última bolha do bot com o texto acumulado
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { from: "bot", text: fullText };
          return updated;
        });
      }

      // Quando o stream termina, traduz o JSON completo pro formato da bolha
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: "bot",
          ...parseAssistantMessage(fullText),
        };
        return updated;
      });
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
    <>
      <div className={`${styles.chatWidget} ${isExpanded ? styles.chatWidgetExpanded : ""}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatHeaderAvatar}>
              <FiMessageCircle size={14} />
            </div>
            <div className={styles.chatHeaderText}>
              <span className={styles.chatHeaderTitle}>Assistente</span>
            </div>
          </div>
          <div className={styles.chatHeaderActions}>
            
            <button
              className={styles.clearHistoryBtn}
              onClick={() => setIsClearing(true)}
              title="Limpar histórico"
              aria-label="Limpar histórico"
            >
              <FiTrash2 size={14} />
            </button>
            <button
              className={styles.expandBtn}
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? "Reduzir" : "Expandir"}
              aria-label={isExpanded ? "Reduzir janela do chat" : "Expandir janela do chat"}
            >
              {isExpanded ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
            </button>
          </div>
        </div>

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
                <button
                  className={styles.downloadPdfBnt}
                  onClick={() => downloadReportPDF(msg.report)}
                >
                  <FiDownload size={14} />
                  Download PDF
                </button>
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

      <ConfirmModal
        isOpen={isClearing}
        title="Limpar histórico"
        message="Tens a certeza que queres limpar todo o histórico do chat?"
        subMessage="Esta ação não pode ser desfeita."
        confirmLabel="Limpar"
        onConfirm={handleClearHistory}
        onCancel={() => setIsClearing(false)}
      />
    </>
  );
}