import * as chatService from "../services/chatService.js";
import { getAllTransactions, summarizeTransactions } from "../services/transactionsService.js";
import pool from "../db.js";

export const sendMessage = async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user.id;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Mensagem não pode estar vazia" });
  }

  try {
    const transactions = await getAllTransactions(userId);
    const totals = summarizeTransactions(transactions);

    console.log("Nº de transações:", transactions.length);
    console.log("Nº de mensagens no histórico:", history.length);

    // Configurar headers para streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullText = "";

    await chatService.sendMessageStream({
      history: (history || []).slice(-5),
      data: { transactions, totals },
      userMessage: message,
      onChunk: (chunk) => {
        fullText += chunk;
        res.write(chunk); // envia pedaço ao frontend
      },
    });

    // Guardar no histórico
    await pool.query(
      "INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)",
      [userId, "user", message],
    );
    await pool.query(
      "INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)",
      [userId, "model", fullText],
    );

    res.end();
  } catch (error) {
    console.error("Erro no chat:", error);
    res.status(500).json({ error: "Erro ao processar mensagem" });
  }
};

export const getHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const [history] = await pool.query(
      "SELECT role, content, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at ASC",
      [userId],
    );

    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};

export const clearHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query("DELETE FROM chat_history WHERE user_id = ?", [userId]);
    res.json({ message: "Histórico eliminado com sucesso" });
  } catch (error) {
    console.error("Erro ao limpar histórico:", error);
    res.status(500).json({ error: "Erro ao limpar histórico" });
  }
};