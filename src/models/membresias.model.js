// Importo la configuracion de la base de datos para empezar a hacer querys
const db = require("../config/db.configuration").promise()

// Se obtiene todas las membresias
const obtenerTodosLasMembresias = async () =>{
    const [rows]= await db.query(`SELECT * FROM membresias`)
    return rows
}

// se obtiene una membresia segun el nombre del usuario
const obtenerMembresia = async (nombre) => {
    const [rows] = await db.query(
        `SELECT 
          membresias.tipo,
          membresias.precio,
          membresias.fecha_inicio,
          membresias.fecha_fin,
          membresias.estado,
          usuarios.nombre AS usuarios_nombre 
        FROM membresias
        JOIN usuarios ON membresias.usuario_id = usuarios.id  
        WHERE usuario.nombre = ? `,[nombre])

        if(rows.length === 0) return null;

        return rows[0];
}

// Se crea membresias
const crearMembresias = async ({usuario_id,tipo,precio,fecha_inicio,fecha_fin,estado}) => {
    const [result] = await db.query(`INSERT INTO membresias 
        (usuario_id,tipo,precio,fecha_inicio,fecha_fin,estado) 
        VALUES (?,?,?,?,?,?)`,
        [usuario_id,tipo,precio,fecha_inicio,fecha_fin,estado]);

        if(result.affectedRows === 0) return null

        return{
            id : result.insertId,
            usuario_id,
            tipo,
            precio,
            fecha_inicio,
            fecha_fin,
            estado
        }
}

// se actualiza membresia
const actualizarMembresias = async ({usuario_id,tipo,precio,fecha_inicio,fecha_fin,estado,id}) => {
    const [result] = await db.query(`UPDATE membresias 
        SET usuario_id = ?, tipo = ?,precio = ?,fecha_inicio = ?,
        fecha_fin = ? ,estado = ? WHERE id = ? `,
        [usuario_id,tipo,precio,fecha_inicio,fecha_fin,estado,id])

        if(result.affectedRows === 0) return null

        return {
         id,
         usuario_id,
         tipo,
         precio,
         fecha_inicio,
         fecha_fin,
         estado,
        }

}

// se elimina membresias
const eliminarMembresia = async (id) => {
   const [result] = await db.query(`DELETE FROM membresias WHERE id = ?`,
    [id])

    if(result.affectedRows === 0) return null

    return true;
}

module.exports= 
{obtenerMembresia,
obtenerTodosLasMembresias,
crearMembresias,
actualizarMembresias,
eliminarMembresia}

