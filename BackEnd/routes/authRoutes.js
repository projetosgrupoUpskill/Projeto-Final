import express from "express";
import { login, /* register */ } from "../controller/authController.js";
import { checkEmailExists, checkEmailNotExists } from "../middleware/checkUser.js";

const router = express.Router();

router.post("/login", checkEmailNotExists, login);
router.post("/register", checkEmailExists);

export default router;
