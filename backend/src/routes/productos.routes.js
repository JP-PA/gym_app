import express from "express"
import
{obtenerTodosLosProductos,
obtenerProducto,
crearProductos,
actualizarProducto,
eliminarProductos } from "../controllers/productos.controller.js"

const router = express.Router()

router.post("/",crearProductos);
router.get("/",obtenerTodosLosProductos);
router.get("/:id",obtenerProducto);
router.put("/:id",actualizarProducto);
router.delete("/:id",eliminarProductos)

export default router
