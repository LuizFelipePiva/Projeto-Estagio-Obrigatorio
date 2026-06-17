import { Router } from "express";

// Importacao dos controllers das vagas
import { createJob } from "../controllers/jobCreate.js";
import { getMyJobs } from "../controllers/myJobs.js";
import { deleteJob } from "../controllers/jobDelete.js";
import { editJob } from "../controllers/jobEdit.js";
import { allJobs } from "../controllers/allJobs.js";

// Importacao do middleware de autenticacao para proteger as rotas de criacao de vagas.
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/allJobs", allJobs);

router.post("/createJob",
    authMiddleware,
    createJob
);

router.get("/myJobs",
    authMiddleware,
    getMyJobs
);

router.delete("/:idvagas", authMiddleware, deleteJob);

router.put("/:idvagas", authMiddleware, editJob);

export default router;
