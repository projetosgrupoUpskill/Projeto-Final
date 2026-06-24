import * as chatService from "../services/chatService.js";
import pool from "../db.js";

export const sendMessage = async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user.id;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Mensagem não pode estar vazia" });
  }

  try {
    // Buscar transações do utilizador para dar contexto à IA
    const [transactions] = await pool.query(
      `SELECT t.id, t.title, t.amount, t.type, t.transaction_date, c.name AS category
       FROM transactions t
       JOIN category c ON t.category_id = c.id
       WHERE t.user_id = ?
       ORDER BY t.transaction_date DESC`,
      [userId],
    );

    // Injetar os dados no contexto da mensagem
    const messageWithContext = `
USER DATA:
${JSON.stringify({ transactions }, null, 2)}

USER MESSAGE:
${message}
    `.trim();

    console.log("Nº de transações:", transactions.length);
    console.log("Nº de mensagens no histórico:", history.length);
    console.log("Tamanho do contexto (chars):", messageWithContext.length);

    // Configurar headers para streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullText = "";

    await chatService.sendMessageStream(
      history || [].slice(-5),
      messageWithContext,
      (chunk) => {
        fullText += chunk;
        res.write(chunk); // envia pedaço ao frontend
      },
    );

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
