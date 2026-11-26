import { saveSale } from "../utils/saleTransaction.js";
import db from "../config/db.configuration.js"
import { obtenerUsuario } from "../models/usuarios.model.js"
import {crearVenta,obtenerTodosLasVentas,obtenerVenta,obtenerDetalleVenta } from "../models/ventas.model.js"
import { obtenerProductoPorId , actualizarStockProducto} from "../models/productos.model.js"
import { crearDetalleVenta } from "../models/detalle_ventas.models.js"

const crearventacompleta = async (input) => {
    const connection = await db.promise().getConnection();
    return saveSale(connection, input, { obtenerUsuario, obtenerProductoPorId, crearVenta, crearDetalleVenta, actualizarStockProducto });
};

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