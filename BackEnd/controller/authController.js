import jwt from "jsonwebtoken";
import { createUser, comparePassword } from "../services/authService.js";

export async function login(req, res) {
  try {
    const user = req.foundUser; //(populado pelo middleware checkEmailExists)
    const { password } = req.body;

    // verifica se pass é correta
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Credenciais inválidas"
      });
    }

    // O método jwt.sign() cria (assina) um JSON Web Token (JWT) que será enviado ao cliente após o login bem-sucedido.
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token, name: user.name });

  } catch (error) {
    return res.status(500).json({
      message: "Erro interno"
    });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios em falta" });
    }

    const id = await createUser(name, email, password);
    return res.status(201).json({ id, message: "Utilizador criado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}