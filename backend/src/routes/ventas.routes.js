import validate from "../middleware/validate.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";
import { crearVentaSchema } from "../validators/venta.validator.js";
import express from "express"

import {
    crearVentaController,obtenerTodasLasVentas,obtenerVentaPorId
} from "../controllers/ventas.controller.js"

const router = express.Router();
router.use(authMiddleware, requireAdmin);

// Crear venta
router.post("/",  validate(crearVentaSchema), crearVentaController)
router.get("/",obtenerTodasLasVentas)
router.get( "/ventas/:id",obtenerVentaPorId);


export default router