const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/usuarios.model.js")

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
     
    if(!correo.includes("@") || typeof correo !== "string"){
        throw new Error("Formato de correo no valido");
        }

    if(typeof nombre !== "string" || nombre.trim() === "" ){
        throw new Error("el nombre no es valido")
    }

    if(typeof password !== "string" || password < 4 ){
        throw new Error("password minimo de 4 caracteres")
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    

    const nuevoUsuario = await userModel.crearUsuarios({ 
        nombre, 
        correo,  });

    return nuevoUsuario;
};

const loginusuario = async ({correo,password}) =>{
    const usuario = await userModel.obtenerUsuarioporcorreo(correo)

    if(!usuario) {
        throw new Error("usuario no encotrado");
    }

    const esValido = await bcryptjs.compare(password, usuario.password);

    if (!esValido){
        throw new Error("Contraseña incorrecta")
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo,
            role: usuario.role
        },
        "secreto_super_seguro",
        {expiresIn: "1h"}
    );

    return{
        usuario,
        token 
    };
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

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioporId,
    actualizarUsuarios,
    eliminarUsuarios,
    loginusuario
}