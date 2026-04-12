const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuarios,
    loginUsuario

} = require("../controllers/usuarios.controller");
const  {authMiddleware } = require("../middleware/auth.middleware");


router.get("/",obtenerUsuarios,authMiddleware);
router.get("/:id",obtenerUsuario);
router.post("/",crearUsuario);
router.put("/:id",actualizarUsuario);
router.delete("/:id",eliminarUsuarios);
router.post("/login",loginUsuario)
;
module.exports = router;