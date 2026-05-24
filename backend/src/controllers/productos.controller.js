import { json } from "express"
import * as productoservice from "../services/productos.service.js"
import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/AppError.js"

const obtenerTodosLosProductos = async (req,res) =>{
    try{
        const productos = await productoservice.obtenerTodosLosProductos()

        return(res.status(200).json({productos}))
    }
   catch(error){
    console.error("no es posible obtener los productos debido a",{error})
    res.status(500).json({mensaje:"error del servidor"})
   }
}

const obtenerProducto = async (req,res) => {
    try{
        const {id} = req.params

        if(isNaN(id)){
            return res.status(400).json({error:"Formato de id invalido"})
        }

        const producto = await productoservice.obtenerPorid(id)

         return producto
    }
    catch(error){
    console.error("no es posible obtener los productos debido a",{error})
    res.status(500).json({mensaje:"error del servidor"})}
}

const crearProductos = catchAsync(async (req,res,next) => {
     
        const {nombre,precio,stock} = req.body

        if(!nombre || precio == null || stock == null )
            throw new AppError("producto incompleta",400);

        const crearproducto = await productoservice.crearProductos({
            nombre,
            precio,
            stock
        });

        res.status(201).json({
            mensaje : "producto creado",
            data : crearProductos
        });


   
    });
    


const actualizarProducto = async(req,res) => {
    try{
        const {nombre,precio,stock} = req.body
        const {id} = req.params

        if (isNaN(id)) {
            return res.status(400).json({error : "id invalido"})
            
        }
        if(!nombre || !precio || !stock )
            return res.status(400).json({error:"los campos no pueder quedar vacios" })

        const actualizarProducto = await productoservice.actualizarProducto({nombre,precio,stock,id})
        res.status(200).json({
            mensaje : "producto creado",
            data : req.body
        })
    }
    catch(error){
        console.log("no fue posible actualizar el producto por ",{error})
        res.status(500).json({mensaje : "error en el servidor"})
    }
}

const eliminarProductos = async(req,res) => {
    try {
        const {id} = req.params

        if(isNaN(id)){
            res.status(400).json({mensaje:"id invalido"})
        }

        const eliminarProductos = await productoservice.eliminarProductos(id)

        res.status(200).json({mensaje : "usuario eliminado exitosamente"})
    } catch (error) {
        console.error("no es posible eliminar el usuario debido a ",{error})
        res.status(500).json({error : "error en el servidor"})
    }
}

export{
crearProductos,
actualizarProducto,
obtenerTodosLosProductos,
eliminarProductos,
obtenerProducto
}

