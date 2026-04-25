import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/usuarios.model.js"
import AppError from "../utils/AppError.js";

const obtenerUsuarios = async () => {
    const usuarios = await userModel.obtenerTodosLosUsuarios();
    return usuarios
};

const obtenerUsuarioporId = async (id) =>{
    const usuarioid = await userModel.obtenerUsuario(id);
    return usuarioid
};

const crearUsuario = async (data) => {
    const { nombre , correo , password } = data;

    const existente = await userModel.obtenerUsuarioPorcorreo(correo);
    if (existente) {
        throw new AppError("El correo ya está registrado", 400);}
     
    const crearUsuario = async (data) => {
    const { nombre, correo, password } = data;

    // 🔍 Validación previa (rápida)
    const existente = await userModel.obtenerUsuarioPorcorreo(correo);
    if (existente) {
        throw new AppError("El correo ya está registrado", 400);
    }

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);

        const nuevoUsuario = await userModel.crearUsuarios({
            nombre,
            correo,
            password: hashedPassword
        });

        return nuevoUsuario;

    } catch (error) {

        // Error real de MySQL
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError("El correo ya está registrado", 400);
        }

        throw error;
    }
};
};


const loginUsuario = async ({ correo, password }) => {

    const usuario = await userModel.obtenerUsuarioPorcorreo(correo);

    if (!usuario) {
        throw new AppError("Usuario no encontrado", 404);
    }

    const esValido = await bcryptjs.compare(password, usuario.password);

    if (!esValido) {
        throw new AppError("Contraseña incorrecta", 401);
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo
        },
        process.env.JWT_SECRET || "dev_secret", // 👈 usa .env en producción
        { expiresIn: "1h" }
    );

    return { usuario, token };
};


const actualizarUsuarios = async (id,data) => {
    const {nombre , correo, password} = data;

    const actualizar = await userModel.actualizarUsuarios({id,nombre,correo,password})

    return actualizar 
};

const eliminarUsuarios  = async (id) => {
    const eliminar = await userModel.eliminarUsuarios(id)

    return eliminar
}

export  {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioporId,
    actualizarUsuarios,
    eliminarUsuarios,
    loginUsuario
}