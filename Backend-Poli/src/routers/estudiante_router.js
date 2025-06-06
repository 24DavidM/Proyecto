import { Router } from "express";
import { registro } from "../controllers/estudiante_controller";

const router = Router()

router.post('/registro',registro)

export default router