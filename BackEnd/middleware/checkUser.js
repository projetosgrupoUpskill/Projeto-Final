import { findUserByEmail } from "../services/authService.js";


export const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(404).json({ error: "Email não encontrado" });
    }

    req.foundUser = users[0]; // Armazena o usuário encontrado para uso posterior
    next();

  } catch (err) {
    next(err);
  }
};

export const checkEmailNotExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const users = await findUserByEmail(email);

    if (users.length > 0) {
      return res.status(409).json({ error: "Email já registado" });
    }

    next();

  } catch (err) {
    next(err);
  }
};