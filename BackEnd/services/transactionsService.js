import pool from "../db.js";

export async function getAllTransactions(user_id) {
  const [rows] = await pool.execute(
    `SELECT 
            t.*,
            c.name  AS category_name,
            c.slug  AS category_slug,
            c.color AS category_color
        FROM transactions t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.transaction_date DESC`,
    [user_id],
  );
  return rows;
}

export async function createTransaction(
  title,
  amount,
  type,
  transaction_date,
  category_id,
  user_id,
  currency_id,
) {
  const [result] = await pool.execute(
    "INSERT INTO transactions (title, amount, type, transaction_date, category_id, user_id, currency_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, amount, type, transaction_date, category_id, user_id, currency_id],
  );
  return result.insertId;
}

export async function updateTransaction(id, user_id, data) {
  const { title, amount, type, transaction_date, currency_id, category_id } =
    data;
  const [result] = await pool.execute(
    `UPDATE transactions
       SET title = ?, amount = ?, type = ?, transaction_date = ?, currency_id = ?, category_id = ?
       WHERE id = ? AND user_id = ?`,
    [
      title,
      amount,
      type,
      transaction_date,
      currency_id,
      category_id,
      id,
      user_id,
    ],
  );
  return result.affectedRows;
}

export async function deleteTransaction(id, user_id) {
  const [result] = await pool.execute(
    "DELETE FROM transactions WHERE id = ? AND user_id = ?",
    [id, user_id],
  );

  return result.affectedRows;
}

//functions para a function calling da Inteligência Artificial
export function getTotals(transactions, startDate, endDate) {
  let filtered = transactions;

  if (startDate || endDate) {
    filtered = transactions.filter((t) => {
      const date = new Date(t.transaction_date);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }

  const dates = filtered.map((t) => new Date(t.transaction_date));
  const actualStart = dates.length ? new Date(Math.min(...dates)) : null;
  const actualEnd = dates.length ? new Date(Math.max(...dates)) : null;

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const categoryBreakdown = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category_name || "Sem categoria";
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {});

  const monthsAvailable = actualStart && actualEnd
    ? (actualEnd.getFullYear() - actualStart.getFullYear()) * 12 +
      (actualEnd.getMonth() - actualStart.getMonth()) + 1
    : 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    categoryBreakdown,
    actual_period: actualStart
      ? `${actualStart.toISOString().slice(0, 10)} a ${actualEnd.toISOString().slice(0, 10)}`
      : null,
    months_available: monthsAvailable,
  };
}

export function getTransactions(transactions, { startDate, endDate, type, category, limit } = {}) {
  let filtered = transactions;

  if (startDate || endDate) {
    filtered = filtered.filter((t) => {
      const date = new Date(t.transaction_date);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }

  if (type) filtered = filtered.filter((t) => t.type === type);
  if (category) filtered = filtered.filter((t) =>
    t.category_name?.toLowerCase() === category.toLowerCase()
  );
  if (limit) filtered = filtered.slice(0, limit);

  return filtered;
}

export function getTrends(transactions, { startDate, endDate, category, monthsBack, monthsAhead } = {}) {
  const today = new Date();

  // Se monthsBack for passado, calcula as datas automaticamente
  if (monthsBack && !startDate) {
    const start = new Date(today);
    start.setMonth(start.getMonth() - monthsBack);
    startDate = start.toISOString().slice(0, 10);
    endDate = endDate || today.toISOString().slice(0, 10);
  }

  let filtered = transactions;

  if (startDate || endDate) {
    filtered = filtered.filter((t) => {
      const date = new Date(t.transaction_date);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }

  if (category) {
    filtered = filtered.filter((t) =>
      t.category_name?.toLowerCase() === category.toLowerCase()
    );
  }

  const expenses = filtered.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const dates = filtered.map((t) => new Date(t.transaction_date));
  const actualStart = dates.length ? new Date(Math.min(...dates)) : null;
  const actualEnd = dates.length ? new Date(Math.max(...dates)) : null;

  const monthsAvailable = actualStart && actualEnd
    ? (actualEnd.getFullYear() - actualStart.getFullYear()) * 12 +
      (actualEnd.getMonth() - actualStart.getMonth()) + 1
    : 1;

  const monthly = totalExpenses / monthsAvailable;
  const weekly = monthly / 4.33;
  const daily = monthly / 30;
  const yearly = monthly * 12;

  const result = {
    daily: parseFloat(daily.toFixed(2)),
    weekly: parseFloat(weekly.toFixed(2)),
    monthly: parseFloat(monthly.toFixed(2)),
    yearly: parseFloat(yearly.toFixed(2)),
    actual_period: actualStart
      ? `${actualStart.toISOString().slice(0, 10)} a ${actualEnd.toISOString().slice(0, 10)}`
      : null,
    months_available: monthsAvailable,
  };

  // Previsão para os próximos meses
  if (monthsAhead) {
    result.forecast = {
      months_ahead: monthsAhead,
      predicted_total: parseFloat((monthly * monthsAhead).toFixed(2)),
      predicted_monthly: parseFloat(monthly.toFixed(2)),
    };
  }

  return result;
}