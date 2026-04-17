import * as membresiaservicer from "../services/membresias.service.js"

const crearMembresia = async(req,res) =>{
    try {
        const { tipo,precio,usuario_id} = req.body

        if(!tipo || !precio || !usuario_id){
            return res.status(400).json({
                mensaje : "Membresia incompleta por favor llenar todos los datos"
            })
        }

        const nuevoUsuario = await membresiaservicer.crearMembresia({tipo,precio,usuario_id})

        return res.status(200).json({
            Mensaje : "Membresia registrada",
            data : nuevoUsuario
        })

    } 
    catch(error)
    {
        console.error("ERROR REAL:", error)
        res.status(500).json({mensaje : "error al registrar la membresia"})
    }
}

const consultarMembresiaid = async (req,res) => {
    try{
    const {usuario_id} = req.params
    

    const consultarid = await membresiaservicer.obtenerMembresiaUsuario(usuario_id)  

    if (!consultarid ) return res.status(404).json({error : 
        "membresia no encontrada"
    })
    
    return res.json(consultarid)
}
    catch(error)

    { console.error(error)
        res.status(500).json({error : "error al obtener la membresia"})
}
}

const consultarMembresias = async (req,res) => {
    try{
        const consultar = await membresiaservicer.obtenerMembresias()

        res.json(consultar)
    }
    catch(error){
        res.status(500).json({error : "error al obtener las membresia"})
    }
}

const actualizarMembresia = async(req,res) =>{
    try{
        const {tipo,precio,usuario_id} = req.body;
        const {id} = req.params

        if(!id) 
            return res.status(404).json({error:"usuario no encontrado"})

        if(!tipo || !precio || !usuario_id)
            return res.status(404).json({error : "los datos no pueden ir vacios"})


        const actualizar = await membresiaservicer.actualizarMembresia(tipo,precio,usuario_id,id)

        return res.status(200).json({
            mensaje : "Membresia actualizada",
            data : actualizar
        })

    }
    catch(error){
        res.status(500).json({error:"error al actualizar membresia"})
    }
}

const eliminarMembresia = async (req,res) => {
    try{
        const {id} = req.params

        const eliminar = await membresiaservicer.eliminarMembresia(id)

            if(!eliminar) 
            return res.status(404).json({error:"membresia no encontrada"})

            return res.status(200).json({
                mensaje : "membresia eliminada"
            })
    }
    catch(error){
        res.status(500).json({mensaje : "error al eliminar la membresia"})
    }
}

export{
consultarMembresiaid,
consultarMembresias,
crearMembresia,
actualizarMembresia,
eliminarMembresia
}