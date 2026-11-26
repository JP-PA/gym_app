import validate from "../middleware/validate.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";
import { crearProductoSchema } from "../validators/producto.validator.js";
import express from "express"
import
{obtenerTodosLosProductos,
obtenerProducto,
crearProductos,
actualizarProducto,
eliminarProductos } from "../controllers/productos.controller.js"

const router = express.Router();
router.use(authMiddleware, requireAdmin);

router.post("/",  validate(crearProductoSchema), crearProductos);
router.get("/",obtenerTodosLosProductos);
router.get("/:id",obtenerProducto);
router.put("/:id",actualizarProducto);
router.delete("/:id",eliminarProductos)

export default router
