import { jwtSecret } from "../config/jwt.configuration.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/usuarios.model.js"
import AppError from "../utils/AppError.js";

const obtenerUsuarios = async (pagination) => {
    const usuarios = await userModel.obtenerTodosLosUsuarios(pagination);
    return usuarios
};

const obtenerUsuarioporId = async (id) =>{
    const usuarioid = await userModel.obtenerUsuario(id);
    return usuarioid
};

const crearUsuario = async (data) => {
    const { nombre, password } = data;
    const correo = data.correo.trim().toLowerCase();

    const existente = await userModel.obtenerUsuarioPorcorreo(correo);
    if (existente) {
        throw new AppError("El correo ya está registrado", 409);}
     
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
            throw new AppError("El correo ya está registrado", 409);
        }

        throw error;
    }
};



const loginUsuario = async ({ correo: inputCorreo, password }) => {
    const correo = inputCorreo.trim().toLowerCase();

    const usuario = await userModel.obtenerUsuarioPorcorreo(correo);

    if (!usuario || typeof usuario.password !== "string" || !usuario.password) {
        throw new AppError("Correo o contraseña incorrectos", 401);
    }

    const esValido = await bcryptjs.compare(password, usuario.password);

    if (!esValido) {
        throw new AppError("Correo o contraseña incorrectos", 401);
    }

    usuario.role = usuario.role === "admin" ? "admin" : "user";
    const token = jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo,
            role: usuario.role
        },
        jwtSecret(),
        { expiresIn: "1h" }
    );

    return { usuario, token };
};


const actualizarUsuarios = async (id,data) => {
    const profile = await userModel.obtenerUsuario(id);
    if (!profile) throw new AppError("Usuario no encontrado", 404);
    const current = await userModel.obtenerUsuarioPorcorreo(profile.correo);
    if (!current) throw new AppError("Usuario no encontrado", 404);
    if (current.role === "admin") throw new AppError("La cuenta administradora no se modifica desde la gestión de clientes", 403);
    const nombre = data.nombre ?? current.nombre;
    const correo = (data.correo ?? current.correo).trim().toLowerCase();
    const existing = await userModel.obtenerUsuarioPorcorreo(correo);
    if (existing && String(existing.id) !== String(id)) throw new AppError("El correo ya está registrado", 409);
    const password = data.password ? await bcryptjs.hash(data.password, 10) : current.password;

    try {
        return await userModel.actualizarUsuarios({id,nombre,correo,password});
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") throw new AppError("El correo ya está registrado", 409);
        throw error;
    }
};

const eliminarUsuarios  = async (id) => {
    const current = await userModel.obtenerUsuario(id);
    if (current?.role === "admin") throw new AppError("No se puede eliminar la cuenta administradora", 403);
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