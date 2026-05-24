import express from "express";
import cors from "cors"
import usuarioRoutes from "./src/routes/usuarios.routes.js";
import membresiaRoutes from "./src/routes/membresias.routes.js";
import productosRoutes from "./src/routes/productos.routes.js";
import ventaRoute from "./src/routes/ventas.routes.js";
import errorHandler  from "./src/middleware/errorHandler.js";

const app = express();

app.use(cors())
app.use(express.json());


app.use("/usuarios", usuarioRoutes);
app.use("/membresias",membresiaRoutes);
app.use("/productos",productosRoutes)
app.use("/ventas",ventaRoute)

app.use(errorHandler)

app.listen(3000 , () => {
    console.log("Servidor escuchando en el puerto 3000")
})