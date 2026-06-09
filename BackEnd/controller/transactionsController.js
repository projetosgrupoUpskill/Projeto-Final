import { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } from "../services/transactionsService.js";

export async function getTransactions(req, res) {
    try {
        const user_id = req.user.id;
        const transactions = await getAllTransactions(user_id);
        return res.json(transactions);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno" });
    }
}

export async function addTransaction(req, res) {
    try {
        const { title, amount, type, transaction_date, category_id, currency_id } = req.body;
        const user_id = req.user.id;

        if (!title || !amount || !type || !transaction_date || !category_id) {
            return res.status(400).json({ message: "Campos obrigatórios em falta" });
        }

        const id = await createTransaction(title, amount, type, transaction_date, category_id, user_id, currency_id || 1);
        return res.status(201).json({ id, message: "Transação criada com sucesso" });

    } catch (error) {
        return res.status(500).json({ message: "Erro interno" });
    }
}

export async function editTransaction(req, res) {
    try {
        const { id } = req.params;
        const { title, amount, type, transaction_date, category_id, currency_id } = req.body;

        if (!title || !amount || !type || !transaction_date || !category_id) {
            return res.status(400).json({ message: "Campos obrigatórios em falta" });
        }

        await updateTransaction(id, title, amount, type, transaction_date, category_id, currency_id || 1);
        return res.json({ message: "Transação atualizada com sucesso" });

    } catch (error) {
        return res.status(500).json({ message: "Erro interno" });
    }
}

export async function removeTransaction(req, res) {
    try {
        const { id } = req.params;
        await deleteTransaction(id);
        return res.json({ message: "Transação apagada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno" });
    }
}