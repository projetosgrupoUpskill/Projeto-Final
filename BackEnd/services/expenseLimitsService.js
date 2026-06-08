import pool from "../db.js";

export async function getLimitsByUser(user_id) {
  const [limits] = await pool.execute(
    `SELECT el.id, el.amount_limit, el.period,
            c.name AS category, c.id AS category_id
     FROM expense_limit el
     JOIN category c ON el.category_id = c.id
     WHERE el.user_id = ?`,
    [user_id],
  );
  return limits;
}

export async function getLimitById(id, user_id) {
  const [limits] = await pool.execute(
    `SELECT el.id, el.amount_limit, el.period,
            c.name AS category, c.id AS category_id
     FROM expense_limit el
     JOIN category c ON el.category_id = c.id
     WHERE el.id = ? AND el.user_id = ?`,
    [id, user_id],
  );
  return limits[0];
}

export async function createLimit(data) {
  const { amount_limit, period, category_id, user_id } = data;
  const [result] = await pool.execute(
    `INSERT INTO expense_limit (amount_limit, period, category_id, user_id)
     VALUES (?, ?, ?, ?)`,
    [amount_limit, period, category_id, user_id],
  );
  return result.insertId;
}

export async function updateLimit(id, user_id, data) {
  const { amount_limit, period } = data;
  const [result] = await pool.execute(
    `UPDATE expense_limit
     SET amount_limit = ?, period = ?
     WHERE id = ? AND user_id = ?`,
    [amount_limit, period, id, user_id],
  );
  return result.affectedRows;
}

export async function deleteLimit(id, user_id) {
  const [result] = await pool.execute(
    "DELETE FROM expense_limit WHERE id = ? AND user_id = ?",
    [id, user_id],
  );
  return result.affectedRows;
}
