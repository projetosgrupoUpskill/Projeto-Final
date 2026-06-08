import "express";
import { login, register } from "../controllers/auth.controller.js";
import { checkEmailExists, checkEmailNotExists } from "../middleware/checkUser.js";

const router = express.Router();

router.post("/login", checkEmailNotExists, login);
router.post("/register", checkEmailExists, register);

export default router;
