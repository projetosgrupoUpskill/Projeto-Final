import express from "express";
import getCategories from "../controller/categoriesController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getCategories);

export default router;