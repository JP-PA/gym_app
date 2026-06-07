// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js"

const Connection = db.promise()

// Se obtienen todas las ventas 
const obtenerTodosLasVentas = async () => {
    const [rows] = await Connection.query(`
      SELECT
        v.id, 
        v.fecha,
        v.total,
        u.nombre AS nombre_usuario 
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
      `)
    return rows
}

// se obtiene ventas por id
const obtenerVenta = async (id) => {
    const [rows] = await Connection.query(`
        SELECT
        v.id, 
        v.fecha,
        v.total,
        u.nombre AS nombre_usuario 
        FROM ventas v
        JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.id = ? `,
        [id])

    if (rows.length === 0) return null;

    return rows[0];
}

const obtenerDetalleVenta = async (venta_id) => {

    const [rows] = await Connection.query(
        `
 SELECT
    dv.id,
    dv.producto_id,
    p.nombre,
    dv.cantidad,
    dv.valor_unitario,
    dv.subtotal
FROM detalle_ventas dv
JOIN productos p
    ON dv.producto_id = p.id
WHERE dv.venta_id = ?
        `,
        [venta_id]
    );

    return rows;
};

// Se inserta la venta 
const crearVenta = async (ConnectionDB, { total, usuario_id }) => {

    const [result] = await ConnectionDB.query(`
      INSERT INTO ventas (fecha,total,usuario_id) 
      VALUES (NOW(),?,?)`,
        [total, usuario_id])

    return {
        id: result.insertId,
        total,
        usuario_id
    }
}

// se actualiza venta

export {
    obtenerTodosLasVentas,
    obtenerVenta,
    obtenerDetalleVenta,
    crearVenta,
}

