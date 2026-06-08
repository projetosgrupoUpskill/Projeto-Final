import express from "express";
import { getTransactions, addTransaction, editTransaction, removeTransaction } from "../controller/transactionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getTransactions);
router.post("/", auth, addTransaction);
router.delete("/:id", auth, removeTransaction);
router.put("/:id", auth, editTransaction);


export default router;