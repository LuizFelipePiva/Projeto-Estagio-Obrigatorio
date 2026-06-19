import { Router } from "express";

import {
  getFreelancerProfile,
  saveFreelancerProfile,
} from "../controllers/freelancerProfile.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/freelancer", authMiddleware, getFreelancerProfile);
router.put("/freelancer", authMiddleware, saveFreelancerProfile);

export default router;
