import * as ventamodel from "../models/ventas.model.js"

const obtenerTodosLasVentas = async() => {

    const obtenerVentas = await ventamodel.obtenerTodosLasVentas()

    if(!obtenerVentas || obtenerVentas.length === 0){
        throw new Error("no hay ventas para mostrar")
    }

    return obtetenerVentas
}

const obtenerVenta = async (nombre) => {

    const obtenerventapornombre = await ventamodel.obtenerVenta(nombre)    

    if(!obtenerventapornombre){
        throw new Error("venta no encontrada");
    }

    return obtenerventapornombre
}

const crearVenta = async(data) => {
    const {fecha,total,usuario_id} = data

    if (total <= 0){
        throw new Error("el total no es correcto");
        
    }

    const crearventas = await ventamodel.crearVenta({fecha,total,usuario_id})

     return crearventas
}

const actualizarVenta = async(id,data) => {
    const {fecha,total,usuario_id} = data;

    if (total <= 0){
        throw new Error("el total no es correcto");
        
    }

    const actualizarventas = await ventamodel.actualizarVenta({fecha,total,usuario_id,id})

     return crearventas
}

const eliminarVenta = async(id) => {

    const eliminarVenta = await ventamodel.eliminarVenta(id);

    if (!eliminarVenta) {
        throw new Error("venta no encontrada")
        
    }

    return eliminarVenta

}

export{
    crearVenta,
    obtenerTodosLasVentas,
    obtenerVenta,
    eliminarVenta,
    actualizarVenta
}