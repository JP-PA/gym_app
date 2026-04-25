import express from "express";
import validate from "../middleware/validate.js"
import validateParams from "../middleware/validateparams.js"
import {obtenerUsuarios,obtenerUsuario,crearUsuario,actualizarUsuario,eliminarUsuarios,loginUsuario
}
from "../controllers/usuarios.controller.js";
import { idSchema,crearUsuarioSchema,actualizarUsuarioSchema} from "../validators/usuario.validator.js";
import authMiddleware  from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/" ,authMiddleware,obtenerUsuarios);
router.get("/:id",validateParams(idSchema),obtenerUsuario);
router.post("/",validate(crearUsuarioSchema),crearUsuario);
router.put("/:id",validate(actualizarUsuarioSchema),actualizarUsuario);
router.delete("/:id",validateParams(idSchema),authMiddleware,eliminarUsuarios);
router.post("/login",loginUsuario);
export default router;