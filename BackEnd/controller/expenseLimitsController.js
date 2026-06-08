import {
  getLimitsByUser,
  getLimitById,
  createLimit,
  updateLimit,
  deleteLimit,
} from "../services/expenseLimitsService.js";

export async function getLimits(req, res) {
  try {
    const limits = await getLimitsByUser(req.user.id);
    return res.json({ limits });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function getLimit(req, res) {
  try {
    const limit = await getLimitById(req.params.id, req.user.id);

    if (!limit) {
      return res.status(404).json({ message: "Limite não encontrado" });
    }

    return res.json({ limit });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function createLimitHandler(req, res) {
  try {
    const { amount_limit, period, category_id } = req.body;

    const insertId = await createLimit({
      amount_limit,
      period,
      category_id,
      user_id: req.user.id,
    });

    return res
      .status(201)
      .json({ id: insertId, message: "Limite criado com sucesso" });
  } catch (error) {
    // UNIQUE constraint (user_id + category_id) violada
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Já existe um limite para esta categoria" });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function updateLimitHandler(req, res) {
  try {
    const affectedRows = await updateLimit(
      req.params.id,
      req.user.id,
      req.body,
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Limite não encontrado" });
    }

    return res.json({ message: "Limite atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteLimitHandler(req, res) {
  try {
    const affectedRows = await deleteLimit(req.params.id, req.user.id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Limite não encontrado" });
    }

    return res.json({ message: "Limite eliminado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}
