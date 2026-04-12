const userservice = require("../services/usuarios.service")

//obtener todos los usuarios
const obtenerUsuarios = async(req,res) => {
    try{
        const usuarios = await userservice.obtenerUsuarios();
        res.json(usuarios)
    }
    catch (error){
        res.status(500).json({mensaje : "Error al obtener usuarios"})

    }
};

// obtener usuarios segun el id
const obtenerUsuario = async(req,res) => {
    try{
       const {id} = req.params;
    
       const usuario = await userservice.obtenerUsuarioporId(id)

       if(!usuario) 
       return res.status(404).json({mensaje : "usuario no encontrado"})

       return(usuario) 
    }
    catch(error){
       return res.status(500).json({mensaje :"error al obtener el usuario" })
    }
}

// crear usuario
const crearUsuario = async (req,res) => {
    try{
        const{nombre,correo,password} = req.body

        if(!nombre || !correo || !password) 
        return res.status(404).
        json({
            mensaje:"completar todos los datos"
        })

        const nuevoUsuario = await userservice.crearUsuario(req.body)

        res.status(201).json(nuevoUsuario)
    }
    catch(error){
        res.status(500).json({mensaje: "error al crear usuario"})
    }
}

// login de usuario
const loginUsuario = async (req,res) =>{
    try{
    const {correo,password} = req.body;

    if(!correo || !password){
        return res.status(400).json({
            error : "correo y contraseña obligatorios"
        })
    }

    const {usuario,token} = await userservice.loginusuario({correo,password})

    return res.status(200).json({
        mensaje : "login exitoso",
        token,
        usuario
    })
}

catch(error){
    return res.status(500).json({
        error : "no autorizado"
    })
}
}

// actualizar usuario 

const actualizarUsuario = async (req,res) => {
    try{
        const {id} = req.params
       const actualizar = await userservice.actualizarUsuarios(id,req.body);

       if(!actualizar) 
        return res.status(404).json({mensaje:"usuario no encontrado"})

       return res.status(200)
    }
    catch(error){
        res.status(500).json({mensaje:"error al actualizar el usuario"})
    }
}

// eliminar usuario

const eliminarUsuarios = async(req,res) =>{
    try{
        const {id} = req.params
        
        const eliminar = await userservice.eliminarUsuarios(id);

        if(!eliminar) 
            return res.status(404).json({error : "usuario no encontrado"})

        return res.status(200).json({mensaje: "usuario eliminado"})
}

catch(error) {
    res.status(500).json({menaje : "error en eliminar este usuario"})
}

}


module.exports = {
    eliminarUsuarios,
    actualizarUsuario,
    crearUsuario,
    obtenerUsuario,
    obtenerUsuarios,
    loginUsuario
}