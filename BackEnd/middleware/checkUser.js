import * as registerService from "../services/registerService.js";

export const checkEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email obrigatório" });
        }

        const user = await registerService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "Email não cadastrado" });
        }

        req.user = user;
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

        const user = await registerService.findUserByEmail(email);

        if (user) {
            return res.status(409).json({ error: "Email já cadastrado. Faça login." });
        }

        next();

    } catch (err) {
        next(err);
    }
};