import pool from "../db.js";

export async function getAllCategories() {
  const [categories] = await pool.execute(
    "SELECT * FROM category"
  );
  return categories;
}