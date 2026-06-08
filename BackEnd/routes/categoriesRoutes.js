import express from "express";
import { getCategories } from "../controllers/categoriesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getCategories);

export default router;