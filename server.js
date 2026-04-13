import express from "express";

import usuarioRoutes from "./src/routes/usuarios.routes.js";

const app = express();

app.use(express.static("public"))
app.use(express.json());

app.use("/usuarios", usuarioRoutes);

app.listen(3000 , () => {
    console.log("Servidor escuchando en el puerto 3000")
})