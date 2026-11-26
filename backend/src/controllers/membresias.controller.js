import { parseListQuery } from "../utils/listFilters.js";
import * as membresiaservicer from "../services/membresias.service.js"
import catchAsync from "../utils/catchAsync.js"

const crearMembresia = catchAsync(async(req,res,next) =>{
    
        const { tipo,precio,usuario_id} = req.body

        const nuevoUsuario = await membresiaservicer.crearMembresia({tipo,precio,usuario_id})

        return res.status(201).json({
            Mensaje : "Membresia registrada",
            data : nuevoUsuario
        })
})

const consultarMembresiaid = catchAsync(async (req,res) => {
    
    const {id} = req.params
    
    const consultarid = await membresiaservicer.obtenerMembresiaUsuario(id)  

    if (!consultarid ) return res.status(404).json({error : 
        "membresia no encontrada"
    })
    
    return res.json(consultarid)
}
    
) 

const consultarMembresias = catchAsync (async (req,res) => {
    
        const consultar = await membresiaservicer.obtenerMembresias(parseListQuery(req.query, "memberships"))

        res.json(consultar)
    
})



const actualizarMembresia = catchAsync(async(req,res) =>{
   
        const {tipo,precio} = req.body;
        const {id} = req.params

        const actualizar = await membresiaservicer.actualizarMembresia(id, { tipo, precio })

        return res.status(200).json({
            mensaje : "Membresía renovada correctamente",
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