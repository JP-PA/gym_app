import express from "express";
import validate from "../middleware/validate.js"
import validateParams from "../middleware/validateparams.js"
import{consultarMembresiaid,consultarMembresias,crearMembresia,actualizarMembresia,eliminarMembresia
}from "../controllers/membresias.controller.js"
import { idSchema,crearMembresiaSchema,actualizarMembresiaSchema} from "../validators/membresia.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",consultarMembresias,authMiddleware);
router.get("/:usuario_id",consultarMembresiaid);
router.post("/",validate(crearMembresiaSchema),crearMembresia);
router.put("/:id",validateParams(idSchema),validate(actualizarMembresiaSchema),actualizarMembresia);
router.delete("/:id",validateParams(idSchema),eliminarMembresia);

export default router;
