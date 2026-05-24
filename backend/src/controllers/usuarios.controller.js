import * as userservice from "../services/usuarios.service.js"
import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/AppError.js"

//obtener todos los usuarios
const obtenerUsuarios = catchAsync(async(req,res) => {   
        const usuarios = await userservice.obtenerUsuarios();
        res.json(usuarios)
});

// obtener usuarios segun el id
const obtenerUsuario = catchAsync(async(req,res) => {
   
       const {id} = req.params;
    
       const usuario = await userservice.obtenerUsuarioporId(id)

       if(!usuario) 
       throw new AppError("Usuario no encontrado",404)

       return res.json(usuario) 
    
})

// crear usuario
const crearUsuario = catchAsync(async (req,res) => {
        const{nombre,correo,password} = req.body

        const nuevoUsuario = await userservice.crearUsuario(req.body)

        res.status(201).json({
            mensaje:"Usuario creado exitosamente",
            data:nuevoUsuario})
    })

// login de usuario
const loginUsuario = catchAsync(async (req, res) => {

    const { correo, password } = req.body;

    const { usuario, token } = await userservice.loginUsuario({ correo, password });

    const { password: _, ...userSafe } = usuario;

    res.json({
        status: "sucess",
        mensaje: "Login exitoso",
        token,
        usuario: userSafe
    });
});

// actualizar usuario 

const actualizarUsuario = catchAsync(async (req,res) => {
       const{nombre,correo,password} = req.body
       const {id} = req.params
       const actualizar = await userservice.actualizarUsuarios({id,nombre,correo,password});

       if(!id) 
        throw new AppError("usuario no encontrado",404)

       return res.status(201).json({
        mensaje : "usuario actualizado",
        data:actualizar
       })
    

})

// eliminar usuario

const eliminarUsuarios = catchAsync(async(req,res) =>{
    
        const {id} = req.params
        
        const eliminar = await userservice.eliminarUsuarios(id);

        if(!eliminar) 
            return res.status(404).json({error : "usuario no encontrado"})

        return res.status(200).json({mensaje: "usuario eliminado"})

})


export  {
    eliminarUsuarios,
    actualizarUsuario,
    crearUsuario,
    obtenerUsuario,
    obtenerUsuarios,
    loginUsuario
}