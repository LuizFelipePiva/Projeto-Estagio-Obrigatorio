import { Router } from "express";
import { login } from "../controllers/login.js";
import { me } from "../controllers/me.js";
import { register } from "../controllers/register.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, me);

export default router;
