import express from "express";
import { sendMessage, getHistory } from "../controller/chatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/history", auth, getHistory);

export default router;
