// Importo la configuracion de la base de datos para empezar a hacer querys
import db  from "../config/db.configuration.js"
 
const connection = db.promise();


// Se obtiene todos los usuarios
const obtenerTodosLosUsuarios = async () => {
   const [rows] = await connection.query(`SELECT * FROM usuarios`);
   return rows
};

// se obtiene un usuario segun el id
const obtenerUsuario = async (id) => {
    const [rows] = await connection.query(`SELECT * FROM usuarios WHERE id = ? `,[id]);
     
    if(rows.length === 0) return null;

    return rows[0];
}
const obtenerUsuarioPorcorreo = async(correo) => {
    const [rows] = await connection.query(`SELECT * FROM usuarios WHERE correo = ? `,
        [correo]
    );

    if(rows.length === 0) return null;

    return rows[0];
}

// Se crea usuarios
const crearUsuarios = async ({nombre,correo,password}) => 
{  
    const [result] = await connection.query(`INSERT INTO usuarios (nombre,correo,password) VALUES (?,?,?)`,
        [nombre,correo,password]);

        if(result.affectedRows === 0) return null;
        
        return {
            id : result.insertId,
            nombre,
            correo
        };
};

// se actualiza usuarios
const actualizarUsuarios = async ({id,nombre,correo,password}) => {
    
    const [result]= await connection.query(`UPDATE usuarios 
        SET nombre = ?,correo = ?,password = ? WHERE id = ? `,
        [nombre,correo,password,id]);

        if(result.affectedRows === 0) return null;
        
        return {
            id,
            nombre,
            correo
        };
};

// se elimina usuarios
const eliminarUsuarios = async (id) =>{
    const [result] = await connection.query(`DELETE FROM usuarios WHERE id = ?`,[id]);
    
    if(result.affectedRows === 0)   return null;
    

    return true;
}



export {
obtenerTodosLosUsuarios,
obtenerUsuario,
crearUsuarios,
actualizarUsuarios,
eliminarUsuarios,
obtenerUsuarioPorcorreo
};

