import db from "../config/db.configuration.js"

const connection = db.promise()

//Get all details of all sells
const obtenerDetallesPorventa = async(venta_id) => {

    const [rows] = await connection.query(`
    SELECT
        dv.id,
        p.nombre AS productos,
        dv.cantidad,
        dv.valor_unitario,
        dv.subtotal
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    WHERE dv.venta_id = ?
        `,[venta_id])

    return rows
}


const crearDetalleVenta = async (connectionDB,
    {
      venta_id,
      producto_id,
      cantidad,
      valor_unitario,
      subtotal}) => {
        const [result] = await connectionDB.query(`
        INSERT INTO detalle_ventas
        (
          venta_id,
          producto_id,
          cantidad,
          valor_unitario,
          subtotal
          ) 
        VALUES (?,?,?,?,?)`
        ,[
            venta_id,
            producto_id,
            cantidad,
            valor_unitario,
            subtotal])

        return {
            id : result.insertId,
            venta_id,
            producto_id,
            cantidad,
            valor_unitario,
            subtotal
        }
}


export {
    obtenerDetallesPorventa,
    crearDetalleVenta
}