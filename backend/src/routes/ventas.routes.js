import express from "express"

import {
    crearVentaController,obtenerTodasLasVentas,obtenerVentaPorId
} from "../controllers/ventas.controller.js"

const router = express.Router()

// Crear venta
router.post("/", crearVentaController)
router.get("/",obtenerTodasLasVentas)
router.get( "/ventas/:id",obtenerVentaPorId);


export default router