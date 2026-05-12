// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js";


const connection = db.promise()

// Se obtiene todos los productos
const obtenerTodosLosProductos = async () =>{

    const [rows] = await connection.query(`
        SELECT * FROM productos
        `)

    return rows
};

// se obtiene un producto segun el id
const obtenerProductoPorId = async (id) => {

    const [rows] = await connection.query(`SELECT * FROM productos 
        WHERE id = ? `,[id])
     
    if (rows.length === 0) return null;

    return rows[0]
}

// Se crea Productos
const crearProducto = async ({nombre,precio,stock}) => {
    const [result] = await connection.query(`INSERT INTO productos (nombre,precio,stock) 
        VALUES (?,?,?)`,
        [nombre,precio,stock])

       if(result.affectedRows === 0) return null;
       
       return{
        id : result.insertId,
        nombre,
        precio,
        stock
       }
}

// se actualiza Productos
const actualizarProducto = async ({id,nombre,precio,stock}) => {
 const [result] = await connection.query(`
    UPDATE productos 
    SET nombre = ?, precio = ?,stock = ? 
    WHERE id = ? `,
    [id,nombre,precio,stock])
        
    if(result.affectedRows === 0) return null  

    return{
        id,
        nombre,
        precio,
        stock
    }

}

//Eliminar productos
const eliminarProducto = async (id) => {
   const [result] = await connection.query(`DELETE FROM productos WHERE id = ?`,
        [id])

    if (result.affectedRows === 0) return null;
    
    return true
}

//Actualizar stock (PARA TRANSACCIONES)

const actualizarStockProducto = async (

    connectionDB,
    {
        cantidad,
        producto_id
      }
) => {
    await connectionDB.query(`
    UPDATE productos 
    SET Stock = stock - ? 
    WHERE id = ? 
    `,[cantidad,producto_id])
}

export 
{obtenerTodosLosProductos,
obtenerProductoPorId,
crearProducto,
actualizarProducto,
eliminarProducto,
actualizarStockProducto
}

