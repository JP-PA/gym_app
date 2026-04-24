// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js"

const conecction = db.promise()

// Se obtienen todas las ventas 
const obtenerTodosLasVentas = async () => {
   const [rows] = await conecction.query(`SELECT * FROM usuarios`)
   return rows
}

// se obtiene venta segun nombre de usuario
const obtenerVenta = async (nombre) => {
    const [rows] = await db.query(`
        SELECT 
        v.fecha,
        v.total,
        usuarios.nombre AS nombre_usuario 
        FROM ventas v
        JOIN usuarios ON v.usuario_id = usuarios.id
        WHERE usuarios.nombre = ? `,
        [nombre])

     if(rows.length === 0) return null;
     
     return rows[0];
}

// Se hace la venta
const crearVenta = async ({fecha,total,usuario_id}) => {
    const [result] = await conecction.query(`INSERT INTO ventas (fecha,total,usuario_id) VALUES (?,?,?)`,
        [fecha,total,usuario_id])

        if(result.affectedRows === 0) return null

        return {
           id : result.insertId,
           fecha,
           total,
           usuario_id
        }



}

// se actualiza venta
const actualizarVenta =  async ({id,fecha,total,usuario_id}) => {
   const [result] = await conecction.query(`UPDATE FROM ventas
         SET fecha = ?,total = ? ,usuario_id = ? 
         WHERE id = ? `,[id,fecha,total,usuario_id])

         if(result.affectedRows === 0) return null;

         return{
            id,
            fecha,
            total,
            usuario_id
         }

}

// se elimina venta
const eliminarVenta = async (id) =>{
   const [result] = await conecction.query(`DELETE FROM usuarios WHERE id = ?`,[id])

   if(result.affectedRows === 0) return null

   return true
}
export 
{obtenerTodosLasVentas,
obtenerVenta,
crearVenta,
actualizarVenta,
eliminarVenta}

