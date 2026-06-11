import pool from "../db.js";
import bcrypt from "bcrypt";

export async function findUserByEmail(email) {
  const [users] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return users;
}

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );
  return result.insertId;
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}