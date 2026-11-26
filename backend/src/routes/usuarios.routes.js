import express from "express";
import validate from "../middleware/validate.js"
import validateParams from "../middleware/validateparams.js"
import {
    obtenerUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuarios, loginUsuario
}
    from "../controllers/usuarios.controller.js";
import { idSchema, loginUsuarioSchema, crearUsuarioSchema, actualizarUsuarioSchema } from "../validators/usuario.validator.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();


// Public registration never accepts a role. Other user operations are admin-only.
router.post("/", validate(crearUsuarioSchema), crearUsuario);
router.post("/login", validate(loginUsuarioSchema), loginUsuario);
router.use(authMiddleware, requireAdmin);
router.get("/", obtenerUsuarios);
router.get("/:id", validateParams(idSchema), obtenerUsuario);
router.put("/:id", validateParams(idSchema), validate(actualizarUsuarioSchema), actualizarUsuario);
router.delete("/:id", validateParams(idSchema), eliminarUsuarios);

export default router;