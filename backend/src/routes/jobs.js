import { Router } from "express";

// Importacao dos controllers das vagas
import { createJob } from "../controllers/jobCreate.js";
import { getMyJobs } from "../controllers/myJobs.js";
import { deleteJob } from "../controllers/jobDelete.js";

// Importacao do middleware de autenticacao para proteger as rotas de criacao de vagas.
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/createJob",
    authMiddleware,
    createJob
);

router.get("/myJobs",
    authMiddleware,
    getMyJobs
);

router.delete("/:idvagas", authMiddleware, deleteJob);

export default router;