import db from "../config/db.configuration.js"
import { obtenerUsuario } from "../models/usuarios.model.js"
import {crearVenta,obtenerTodosLasVentas,obtenerVenta,obtenerDetalleVenta } from "../models/ventas.model.js"
import { obtenerProductoPorId , actualizarStockProducto} from "../models/productos.model.js"
import { crearDetalleVenta } from "../models/detalle_ventas.models.js"

const crearventacompleta = async({usuario_id,productos}) => {
 
    //conexion para transacción

    const conecction = await db.promise().getConnection()

    try {
        // inicia la transaccion
        await conecction.beginTransaction()

        //validar usuarios
        const usuario = await obtenerUsuario(usuario_id)
        if(!usuario){
            throw new Error("El usuario no existe")
        }

        //validar productos vacios

        if(!productos || productos.length === 0){
            throw new Error("Debe agregar productos")
        }

        let total = 0

        const detalles = []

        for(const item of productos){
            const {producto_id,cantidad} = item

            if(cantidad <= 0){
                throw new Error("cantidad invalida")
            }

            //buscar producto
            const producto = await obtenerProductoPorId(producto_id)

            //se valida la existencia
            if(!producto){
                throw new Error(`Producto ${producto_id} no existe`)
            }
            if(producto.stock < cantidad){
                throw new Error(`Stock insuficiente para ${producto.nombre} `)

                
            }
            //calcular subtotal
            const subtotal = cantidad * producto.precio

            //Acumular total
            total += subtotal

            //guardar detalle temporal
            detalles.push({
                producto_id,
                cantidad,
                valor_unitario:producto.precio,
                subtotal
            })
        }
        //crear venta
        const venta = await crearVenta(conecction,
            {
                total,
                usuario_id
            }
        )
        //Insertar detalles
        for(const detalle of detalles){
            //crear detalle

            await crearDetalleVenta(
                conecction,{
                    venta_id : venta.id,
                    producto_id: detalle.producto_id,
                    cantidad : detalle.cantidad,
                    valor_unitario : detalle.valor_unitario,
                    subtotal: detalle.subtotal
                }
            )
            await actualizarStockProducto(
                conecction,
                {
                    producto_id:detalle.producto_id,
                    cantidad: detalle.cantidad
                }
            )
        }

        await conecction.commit()

        return{
            message : "venta registrada correctamente",
            venta_id : venta.id,
            total       
        }
    } catch(error){

        await conecction.rollback()

        throw error
    } finally{
        conecction.release()
    }
}   

const obtenerventas = async()=>{
    return await obtenerTodosLasVentas
}
const obtenerVentaCompleta = async(id) => {

    const venta = await obtenerVenta(id);

    if(!venta){
        return null;
    }

    const detalles =
        await obtenerDetalleVenta(venta.id);

    return {
        ...venta,
        productos: detalles
    };
};

export {crearventacompleta,obtenerTodosLasVentas,obtenerVentaCompleta}