// Importo la configuracion de la base de datos para empezar a hacer querys
const db = require("../config/db.configuration").promise()

// Se obtiene todos los usuarios
const obtenerTodosLosUsuarios = async () => {
   const [rows] = await db.query(`SELECT * FROM usuarios`);
return rows};

// se obtiene un usuario segun el id
const obtenerUsuario = async (id) => {
    const [rows] = await db.query(`SELECT * FROM usuarios WHERE id = ? `,[id]);
     
    if(rows.length === 0) return null;

    return rows[0];
}
const obtenerUsuarioporcorreo = async(correo) => {
    const [rows] = await db.query(`SELECT * FROM usuarios WHERE correo = ? `,[correo]);

    if(rows.length === 0) return null;

    return rows[0];
}

// Se crea usuarios
const crearUsuarios = async ({nombre,correo,password}) => 
{  
    const [result] = await db.query(`INSERT INTO usuarios (nombre,correo,password) VALUES (?,?,?)`,
        [nombre,correo,password]);

        if(result.affectedRows === 0) return null;
        
        return {
            id : result.insertId,
            nombre,
            correo
        };
};

// se actualiza usuarios
const actualizarUsuarios = async ({id,nombre,password}) => {
    
    const [result]= await db.query(`UPDATE usuarios 
        SET nombre = ?,correo = ?,password = ? WHERE id = ? `,[nombre,correo,password,id]);

        if(result.affectedRows === 0)    return null;
        
        return {
            id,
            nombre,
            correo
        };
};

// se elimina usuarios
const eliminarUsuarios = async (id) =>{
    const [result] = await db.query(`DELETE FROM usuarios WHERE id = ?`,[id]);
    
    if(result.affectedRows === 0)   return null;
    

    return true;
}

module.exports = 
{obtenerTodosLosUsuarios,
obtenerUsuario,
crearUsuarios,
actualizarUsuarios,
eliminarUsuarios,
obtenerUsuarioporcorreo}

