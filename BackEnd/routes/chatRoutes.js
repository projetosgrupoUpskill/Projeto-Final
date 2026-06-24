import express from "express";
import { sendMessage, getHistory, clearHistory } from "../controller/chatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/history", auth, getHistory);
router.delete("/history", auth, clearHistory);

export default router;
