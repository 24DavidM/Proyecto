import { Router } from "express";
import { confirmarMail, recuperarPassword, registro } from "../controllers/estudiante_controller.js"

const router = Router()

router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)
router.post('/recuperarpassword',recuperarPassword)

export default router