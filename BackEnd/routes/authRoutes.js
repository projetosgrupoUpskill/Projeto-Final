import express from "express";
import { login, register, deleteAccount } from "../controller/authController.js";
import { checkEmailExists, checkEmailNotExists } from "../middleware/checkUser.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login",    checkEmailExists,    login);    
router.post("/register", checkEmailNotExists, register);
router.delete("/account", auth, deleteAccount);

export default router;
