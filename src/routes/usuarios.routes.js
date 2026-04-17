import express from "express";
import {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuarios,
    loginUsuario
}
from "../controllers/usuarios.controller.js";
import authMiddleware  from "../middleware/auth.middleware.js";

const router = express.Router();

//Rutas protegidas
router.get("/", obtenerUsuarios);

// rutas normales
router.get("/:id",obtenerUsuario);
router.post("/",crearUsuario);
router.put("/:id",actualizarUsuario);

//eliminar protegido
router.delete("/:id",eliminarUsuarios);

//login
router.post("/login",loginUsuario);
export default router;