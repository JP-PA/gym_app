// Importo la configuracion de la base de datos para empezar a hacer querys
const db = require("../config/db.configuration")

// Se obtiene todos los usuarios
const obtenerTodoslasmembresias = (callback) =>{
    db.query(`SELECT * FROM membresias`,callback)
}

// se obtiene un usuario segun el id
const obtenerusuario = (id,callback) => {
    db.query(`SELECT * FROM membresia WHERE id = ? `,[id],callback)
}

// Se crea usuarios
const crearusuarios = (id,nombre,correo,callback) => {
    db.query(`INSERT INTO usuarios (id,nombre,correo) VALUES (?,?,?)`,
        [id,nombre,correo]
        ,callback)
}

// se actualiza usuarios
const actualizarusuarios = (id,nombre,correo,callback) => {
    db.query(`UPDATE FROM usuarios SET nombre = ?,correo = ? WHERE id = ? `,[id,nombre,correo],callback)

}

// se elimina usuarios
const eliminarusuarios = (id,callback) =>{
    db.query(`DELETE FROM usuarios WHERE id = ?`,[id],callback)
}

module.export = {obtenerTodoslosusuarios,obtenerusuario,crearusuarios,actualizarusuarios,eliminarusuarios}

