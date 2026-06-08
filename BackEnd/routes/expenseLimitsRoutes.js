import express from "express";
import {
  getLimits,
  getLimit,
  createLimitHandler,
  updateLimitHandler,
  deleteLimitHandler
} from "../controllers/expenseLimitsController.js";
import auth  from "../middleware/auth.js";

const router = express.Router();

router.get("/",      auth, getLimits);
router.get("/:id",   auth, getLimit);
router.post("/",     auth, createLimitHandler);
router.put("/:id",   auth, updateLimitHandler);
router.delete("/:id", auth, deleteLimitHandler);

export default router;