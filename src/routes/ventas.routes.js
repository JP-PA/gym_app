import express from "express"

import {
    crearVentaController
} from "../controllers/ventas.controller.js"

const router = express.Router()

// Crear venta
router.post("/", crearVentaController)

export default router