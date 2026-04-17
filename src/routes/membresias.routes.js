import express from "express";

import{
consultarMembresiaid,
consultarMembresias,
crearMembresia,
actualizarMembresia,
eliminarMembresia
} from "../controllers/membresias.controller.js"


const router = express.Router();

router.get("/",consultarMembresias);
router.get("/:usuario_id", consultarMembresiaid);
router.post("/",crearMembresia);
router.put("/:id",actualizarMembresia);
router.delete("/:id",eliminarMembresia);

export default router;
