import express from "express";
import usuarioRoutes from "./src/routes/usuarios.routes.js";
import membresiaRoutes from "./src/routes/membresias.routes.js"
import productosRoutes from "./src/routes/productos.routes.js"
import errorHandler  from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/membresias",membresiaRoutes);
app.use("/productos",productosRoutes)

app.use(errorHandler)

app.listen(3000 , () => {
    console.log("Servidor escuchando en el puerto 3000")
})