import jwt from "jsonwebtoken";
import { createUser, comparePassword, findUserById, deleteUserAccount } from "../services/authService.js";

export async function login(req, res) {
  try {
    const user = req.foundUser; //(populado pelo middleware checkEmailExists)
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password é obrigatório"
      });
    } 
/*     if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password deve conter pelo menos uma letra maiúscula e um número"
      });
    }  */

    // verifica se pass é correta
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Senha incorreta"
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

    if (password.length < 6) {
      return res.status(400).json({ message: "Password deve ter pelo menos 6 caracteres" });
    }

    const id = await createUser(name, email, password);
    return res.status(201).json({ id, message: "Utilizador criado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteAccount(req, res) {
  try {
    const { password } = req.body;
 
    if (!password) {
      return res.status(400).json({ message: "Password é obrigatória para confirmar" });
    }
 
    // req.user vem do token JWT (só tem o id), por isso vamos buscar o
    // utilizador completo à BD para podermos comparar a password.
    const user = await findUserById(req.user.id);
 
    if (!user) {
      // O token é válido mas a conta já não existe (ex.: já foi apagada
      // antes noutra aba/sessão).
      return res.status(404).json({ message: "Utilizador não encontrado" });
    }
 
    const isValid = await comparePassword(password, user.password);
 
    if (!isValid) {
      return res.status(401).json({ message: "Senha incorreta" });
    }
 
    await deleteUserAccount(user.id);
 
    return res.json({ message: "Conta eliminada com sucesso" });
 
  } catch (error) {
    return res.status(500).json({ message: "Erro ao apagar conta" });
  }
}