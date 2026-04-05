// Importo la configuracion de la base de datos para empezar a hacer querys
const db = require("../config/db.configuration").promise()

// Se obtiene todos los productos
const obtenerTodosLosProductos = async () =>{
    const [rows] = await db.query(`SELECT * FROM productos`)
    return rows
};

// se obtiene un producto segun el id
const obtenerProducto = async (id) => {
    const [rows] = await db.query(`SELECT * FROM productos WHERE id = ? `,[id])
     
    if (rows.length === 0) return null;

    return rows[0]
}

// Se crea Productos
const crearProductos = async ({nombre,precio,stock}) => {
    const [result] = await db.query(`INSERT INTO productos (nombre,precio,stock) VALUES (?,?,?)`,
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
const actualizarProductos = async ({id,nombre,precio,stock}) => {
 const [result] = await db.query(`UPDATE productos 
    SET nombre = ?, precio = ?,stock = ? WHERE id = ? `,
        [nombre,precio,stock,id])
        
    if(result.affectedRows === 0) return null  

    return{
        id,
        nombre,
        precio,
        stock
    }

}

// se elimina usuarios
const eliminarProductos = async (id) => {
   const [result] = await db.query(`DELETE FROM productos WHERE id = ?`,
        [id])

    if (result.affectedRows === 0) return null;
    
    return true
}

module.exports = 
{obtenerTodosLosProductos,
obtenerProducto,
crearProductos,
actualizarProductos,
eliminarProductos}

