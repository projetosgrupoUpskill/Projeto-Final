import pool from "../db.js";

export async function getAllTransactions(user_id) {
    const [rows] = await pool.execute(
        "SELECT * FROM transactions WHERE user_id = ?",
        [user_id]
    );
    return rows;
}

export async function createTransaction(title, amount, type, transaction_date, category_id, user_id, currency_id) {
    const [result] = await pool.execute(
        "INSERT INTO transactions (title, amount, type, transaction_date, category_id, user_id, currency_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, amount, type, transaction_date, category_id, user_id, currency_id]
    );
    return result.insertId;
}

export async function updateTransaction(id, user_id, data) {
    const { title, amount, type, transaction_date, currency_id, category_id } = data;
    const [result] = await pool.execute(
        `UPDATE transactions
       SET title = ?, amount = ?, type = ?, transaction_date = ?, currency_id = ?, category_id = ?
       WHERE id = ? AND user_id = ?`,
        [title, amount, type, transaction_date, currency_id, category_id, id, user_id]
    );
    return result.affectedRows;
}

export async function deleteTransaction(id, user_id) {
    const [result] = await pool.execute(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [id, user_id]
    );

    return result.affectedRows;
}