import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
/* import userRoutes from "./routes/userRoutes.js"; */
import categoriesRoutes from "./routes/categoriesRoutes.js";
import expenseLimitsRoutes from "./routes/expenseLimitsRoutes.js";
/* import chatRoutes from "./routes/chatRoutes.js"; */

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/transactions", transactionsRoutes);
/* app.use("/users", userRoutes); */
app.use("/categories", categoriesRoutes);
app.use("/expense-limits", expenseLimitsRoutes);
/* app.use("/chat", chatRoutes ); */

// Rota de teste - revisar arquivo
app.get("/", (req, res) => {
  res.json({ message: "API a funcionar!" });
});

// Erro global - revisar arquivo
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});