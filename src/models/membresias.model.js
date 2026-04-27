// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js"

const connection = db.promise();

// Se obtiene todas las membresias
const obtenerTodasLasMembresias = async () =>{
    const [rows]= await connection.query(`SELECT 
    m.id,
    m.tipo,
    m.precio,
    m.estado,
    u.nombre AS usuario_nombre
FROM membresias m
JOIN usuarios u ON m.usuario_id = u.id;`)
    return rows
}

// se obtiene una membresia segun el nombre del usuario
const obtenerMembresia = async (usuario_id) => {
    console.log("usuario_id:", usuario_id)
    const [rows] = await connection.query(
        `SELECT 
          m.tipo,
          m.precio,
          m.fecha_inicio,
          m.fecha_fin,
          m.estado,
          usuarios.nombre AS nombre_usuario
        FROM membresias m
        JOIN usuarios ON m.usuario_id = usuarios.id  
        WHERE m.usuario_id = ? `,[usuario_id])

        if(rows.length === 0) return null;

        return rows[0];
}

// Se crea membresias
const crearMembresias = async ({tipo,precio,fecha_inicio,fecha_fin,estado,usuario_id}) => {
    const [result] = await connection.query(`INSERT INTO membresias 
        (tipo,precio,fecha_inicio,fecha_fin,estado,usuario_id) 
        VALUES (?,?,?,?,?,?)`,
        [tipo,precio,fecha_inicio,fecha_fin,estado,usuario_id]);

        if(result.affectedRows === 0) return null

        return{
            id : result.insertId,
            tipo,
            precio,
            fecha_inicio,
            fecha_fin,
            estado,
            usuario_id
        }
}

// se actualiza membresia
const actualizarMembresias = async ({tipo,precio,fecha_inicio,fecha_fin,estado,usuario_id,id}) => {
    const [result] = await connection.query(`UPDATE membresias 
        SET  tipo = ?,precio = ?,fecha_inicio = ?,
        fecha_fin = ? ,estado = ?,usuario_id = ? WHERE id = ? `,
        [tipo,precio,fecha_inicio,fecha_fin,estado,usuario_id,id])

        if(result.affectedRows === 0) return null

        return {
         id,
         tipo,
         precio,
         fecha_inicio,
         fecha_fin,
         estado,
         usuario_id,
        }

}

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

