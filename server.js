const express = require('express');
const app = express();

app.use(express.json());

const usuarioRoutes = require("./src/routes/usuarios.routes")
const ProductoRoutes = require("./src/routes/productos.routes")
const membresiaRoutes = require("./src/routes/membresias.routes")
const ventasRoutes = require("./src/routes/ventas.routes")

app.listen(3000 , () => {
    console.log("Servidor escuchando en el puerto 3000")
})