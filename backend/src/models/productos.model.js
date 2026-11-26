import AppError from "../utils/AppError.js";
import { queryFilteredPage } from "../utils/listFilters.js";
// Importo la configuracion de la base de datos para empezar a hacer querys
import db from "../config/db.configuration.js";


const connection = db.promise()

// Se obtiene todos los productos
const obtenerTodosLosProductos = async (pagination) => {
    const select = `SELECT p.*`;
    const from = `FROM productos p`;
    if (pagination) return queryFilteredPage(connection, "products", select, from, "p.id DESC", pagination);
    const [rows] = await connection.query(`${select} ${from} ORDER BY p.id DESC`);
    return rows;
};

// se obtiene un producto segun el id
const obtenerProductoPorId = async (id, transaction) => {

    const [rows] = await (transaction || connection).query(`SELECT * FROM productos WHERE id = ?${transaction ? " FOR UPDATE" : ""}`, [id])
     
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
    const [result] = await connectionDB.query(`
    UPDATE productos 
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
    `,[cantidad,producto_id,cantidad]);
    if (result.affectedRows !== 1) throw new AppError("Stock insuficiente", 409);
}

export 
{obtenerTodosLosProductos,
obtenerProductoPorId,
crearProducto,
actualizarProducto,
eliminarProducto,
actualizarStockProducto
}

