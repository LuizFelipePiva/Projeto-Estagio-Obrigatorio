import { Router } from 'express';

// Importacao dos controllers das vagas

import { minhasVagas } from "../controllers/minhasVagas.js";

// Importacao do middleware de autenticacao para proteger as rotas de criacao de vagas.
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/minhasVagas/:id_usuario",
    authMiddleware,
    minhasVagas
);

export default router;