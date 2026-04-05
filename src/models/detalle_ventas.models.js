const db = require('../config/db.configuration').promise()

const obtenerTodosLosDetalles = async() => {
    const [rows] = await db.query(`SELECT * FROM detalle_ventas`)
    return rows
}
const obtenerDetalleProducto = async(nombre) =>{
    const[rows] = await db.query(
        `SELECT
        detalle_ventas.cantidad,
        detalle_ventas.subtotal,
        productos.nombre AS nombre_producto,
        productos.precio AS precio_producto,
        ventas.fecha AS fecha_venta,
        ventas.total AS total_venta
        FROM detalle_ventas
        JOIN productos ON detalle_ventas.producto_id = productos.id
        JOIN ventas ON detalle_ventas.venta_id = ventas.id
        WHERE productos.nombre = ?`,[nombre])

        if(rows.lenght === 0) return null

        return rows[0]

        
} 

const crearDetalleVenta = async ({venta_id,producto_id,cantidad,subtotal}) => {
    const [result] = await db.query(`
        INSERT INTO detalle_venta (venta_id,producto_id,cantidad,subtotal) 
        VALUES (?,?,?,?)`[venta_id,producto_id,cantidad,subtotal])

        if(result.affectedRows === 0) return null

        return {
            id : result.insertId,
            venta_id,
            producto,
            cantidad,
            subtotal
        }
}

const actualizarDetalleVenta = async({id,venta_id,producto_id,cantidad,subtotal}) => {
    const [result] = await db.query(
        `UPDATE detalle_venta 
        SET venta_id = ?,
        producto_id = ?,
        cantidad = ?,
        subtotal=?
        WHERE id = ? `
     [id,venta_id,producto_id,cantidad,subtotal])

     if(result.affectedRows === 0) return null

     return{
        id,
        venta_id,
        producto_id,
        cantidad,
        subtotal
     }
}

const eliminarDetalleVenta = async (id) => {
    const[result] = await db.query(`DELETE FROM detalle_venta WHERE id = ?`,[id])

    if(result.affectedRows) return null

    return true
}

module.exports = {
    obtenerDetalleProducto,
    obtenerTodosLosDetalles,
    crearDetalleVenta,
    actualizarDetalleVenta,
    eliminarDetalleVenta
}