import express from "express";
import { login, register } from "../controller/authController.js";
import { checkEmailExists, checkEmailNotExists } from "../middleware/checkUser.js";

const router = express.Router();

router.post("/login",    checkEmailExists,    login);    
router.post("/register", checkEmailNotExists, register);

export default router;
