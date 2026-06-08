import pool from "../db.js";
import bcrypt from "bcrypt";

export async function findUserByEmail(email) {
  const [users] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return users;
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}