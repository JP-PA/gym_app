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
        usuarios.nombre AS nombre_usuario 
        FROM ventas v
        JOIN usuarios ON v.usuario_id = u.id
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
        usuarios.nombre AS nombre_usuario 
        FROM ventas v
        JOIN usuarios ON v.usuario_id = u.id
        WHERE v.id = ? `,
        [id])

     if(rows.length === 0) return null;
     
     return rows[0];
}

// Se inserta la venta 
const crearVenta = async (ConnectionDB,{total,usuario_id}) => {

    const [result] = await ConnectionDB.query(`
      INSERT INTO ventas (fecha,total,usuario_id) 
      VALUES (NOW(),?,?)`,
        [total,usuario_id])

        return {
           id : result.insertId,
           total,
           usuario_id
        }
}

// se actualiza venta
const actualizarVenta =  async ({id,total,usuario_id}) => {
   const [result] = await conecction.query(`
      UPDATE ventas
      SET total = ? ,usuario_id = ? 
      WHERE id = ? `
      ,[id,total,usuario_id])

         if(result.affectedRows === 0) return null;

         return{
            id,
            total,
            usuario_id
         }

}

// se elimina venta
const eliminarVenta = async (id) =>{

   const [result] = await conecction.query(`
      DELETE FROM ventas 
      WHERE id = ?`
      ,[id])

   if(result.affectedRows === 0) return null

   return true
}

export {
obtenerTodosLasVentas,
obtenerVenta,
crearVenta,
actualizarVenta,
eliminarVenta
}

