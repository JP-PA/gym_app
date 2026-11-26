import { queryFilteredPage } from "../utils/listFilters.js";
// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js"

const connection = db.promise();

// Se obtiene todas las membresias
const obtenerTodasLasMembresias = async (pagination) => {
    const select = `SELECT m.id, m.tipo, m.precio, m.usuario_id, m.fecha_inicio, m.fecha_fin, CASE WHEN m.fecha_fin >= CURDATE() THEN 'activa' ELSE 'vencida' END AS estado, u.nombre AS usuario_nombre`;
    const from = `FROM membresias m JOIN usuarios u ON m.usuario_id = u.id`;
    if (pagination) return queryFilteredPage(connection, "memberships", select, from, "m.id DESC", pagination);
    const [rows] = await connection.query(`${select} ${from} ORDER BY m.id DESC`);
    return rows;
};

// se obtiene una membresia segun el nombre del usuario
const obtenerMembresia = async (id) => {
    const [rows] = await connection.query(
           `SELECT 
          m.id,
          m.tipo,
          m.precio,
          m.usuario_id, 
          m.fecha_inicio,
          m.fecha_fin,
          CASE 
                WHEN m.fecha_fin >= CURDATE() THEN 'activa'
                ELSE 'vencida'
            END AS estado,
          usuarios.nombre AS usuario_nombre
        FROM membresias m
        JOIN usuarios ON m.usuario_id = usuarios.id  
        WHERE m.id = ?`, [id]
    );


        if(rows.length === 0) return null;

        return rows[0];
}

// Se crea membresias
const crearMembresias = async ({tipo,precio,fecha_inicio,fecha_fin,usuario_id}) => {
    const [result] = await connection.query(`INSERT INTO membresias 
        (tipo,precio,fecha_inicio,fecha_fin,usuario_id) 
        VALUES (?,?,?,?,?)`,
        [tipo,precio,fecha_inicio,fecha_fin,usuario_id]);

        if(result.affectedRows === 0) return null

        return{
            id : result.insertId,
            tipo,
            precio,
            fecha_inicio,
            fecha_fin,
            usuario_id
        }
}

// La condición de vencimiento evita dos renovaciones simultáneas.
// CURDATE usa la misma fecha de MySQL que el estado calculado en los listados.
const actualizarMembresias = async ({ id, tipo, precio, dias }) => {
    const [result] = await connection.query(`
        UPDATE membresias
        SET tipo = ?, precio = ?, fecha_inicio = CURDATE(),
            fecha_fin = DATE_ADD(CURDATE(), INTERVAL ? DAY), estado = 'activa'
        WHERE id = ? AND fecha_fin < CURDATE()
    `, [tipo, precio, dias, id]);
    return result.affectedRows === 1;
};

// se elimina membresias
const eliminarMembresia = async (id) => {
   const [result] = await connection.query(`DELETE FROM membresias WHERE id = ?`,
    [id])

    if(result.affectedRows === 0) return null

    return true;
}

export{
obtenerMembresia,
obtenerTodasLasMembresias,
crearMembresias,
actualizarMembresias,
eliminarMembresia}


export async function obtenerClientesConMensualidadVencida() {
    const [clientes] = await connection.query(`
        SELECT u.id, TRIM(u.correo) AS correo
        FROM usuarios u
        WHERE u.role = ? AND TRIM(u.correo) <> ''
          AND EXISTS (
              SELECT 1 FROM membresias m
              WHERE m.usuario_id = u.id AND m.tipo = ? AND m.fecha_fin < CURDATE()
          )
          AND NOT EXISTS (
              SELECT 1 FROM membresias m
              WHERE m.usuario_id = u.id AND m.fecha_fin >= CURDATE()
          )
        ORDER BY u.id
    `, ["user", "mensual"]);
    return clientes;
}
