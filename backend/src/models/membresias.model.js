// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js"

const connection = db.promise();

// Se obtiene todas las membresias
const obtenerTodasLasMembresias = async () =>{
    const [rows]= await connection.query(
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
            u.nombre AS usuario_nombre
        FROM membresias m
        JOIN usuarios u ON m.usuario_id = u.id`)
    return rows
}

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

//En esta consulta se obtienen los que estan activos
const obteneractiva = async() => {
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
            END AS estado,,
          usuarios.nombre AS usuario_nombre
        FROM membresias m
        JOIN usuarios ON m.usuario_id = usuarios.id 
        WHERE m.fecha_fin >= CURDATE()`);
        
        if(rows.length === 0) return null;

        return rows;
};

//En esta consulta se obtienen los que estan inactivos
const obtenerinactivas = async() => {
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
            END AS estado,,
          usuarios.nombre AS usuario_nombre
        FROM membresias m
        JOIN usuarios ON m.usuario_id = usuarios.id 
        WHERE m.fecha_fin < CURDATE()`);
        
        if(rows.length === 0) return null;

        return rows;

        
};

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

// se actualiza membresia
const actualizarMembresias = async ({tipo,precio,fecha_inicio,fecha_fin,usuario_id,id}) => {
    const [result] = await connection.query(`UPDATE membresias 
        SET  tipo = ?,precio = ?,fecha_inicio = ?,
        fecha_fin = ? ,usuario_id = ? WHERE id = ? `,
        [tipo,precio,fecha_inicio,fecha_fin,usuario_id,id])

        if(result.affectedRows === 0) return null

        return {
         id,
         tipo,
         precio,
         fecha_inicio,
         fecha_fin,
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

