import * as membresiaservicer from "../services/membresias.service.js"
import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/AppError.js"

const crearMembresia = catchAsync(async(req,res,next) =>{
    
        const { tipo,precio,usuario_id} = req.body

        const nuevoUsuario = await membresiaservicer.crearMembresia({tipo,precio,usuario_id})

        return res.status(201).json({
            Mensaje : "Membresia registrada",
            data : nuevoUsuario
        })
})

const consultarMembresiaid = catchAsync(async (req,res) => {
    
    const {usuario_id} = req.params
    
    const consultarid = await membresiaservicer.obtenerMembresiaUsuario(usuario_id)  

    if (!consultarid ) return res.status(404).json({error : 
        "membresia no encontrada"
    })
    
    return res.json(consultarid)
}
    
) 

const consultarMembresias = catchAsync (async (req,res) => {
    
        const consultar = await membresiaservicer.obtenerMembresias()

        res.json(consultar)
    
})

const actualizarMembresia = catchAsync(async(req,res) =>{
   
        const {tipo,precio,usuario_id} = req.body;
        const {id} = req.params

        const actualizar = await membresiaservicer.actualizarMembresia(tipo,precio,usuario_id,id)

        return res.status(201).json({
            mensaje : "Membresia actualizada",
            data : actualizar
        })

    })

const eliminarMembresia = catchAsync(async (req,res) => {
    
        const {id} = req.params

        const eliminar = await membresiaservicer.eliminarMembresia(id)

            if(!eliminar) 
            return res.status(404).json({error:"membresia no encontrada"})

            return res.status(200).json({
                mensaje : "membresia eliminada"
            })
            })
    

export{
consultarMembresiaid,
consultarMembresias,
crearMembresia,
actualizarMembresia,
eliminarMembresia
}