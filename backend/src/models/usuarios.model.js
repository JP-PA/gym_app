import AppError from "../utils/AppError.js";
import { queryFilteredPage } from "../utils/listFilters.js";
// Importo la configuracion de la base de datos para empezar a hacer querys
import db  from "../config/db.configuration.js"
 
const connection = db.promise();


// Se obtiene todos los usuarios
const obtenerTodosLosUsuarios = async (pagination) => {
    const select = `SELECT u.id, u.nombre, u.correo, u.created_at`;
    const from = `FROM usuarios u`;
    if (pagination) return queryFilteredPage(connection, "users", select, from, "u.id DESC", pagination);
    const [rows] = await connection.query(`${select} ${from} ORDER BY u.id DESC`);
    return rows;
};

// se obtiene un usuario segun el id
const obtenerUsuario = async (id, transaction) => {
    const [rows] = await (transaction || connection).query(`SELECT id, nombre, correo, created_at, role FROM usuarios WHERE id = ?${transaction ? " FOR UPDATE" : ""}`, [id]);
     
    if(rows.length === 0) return null;

    return rows[0];
}
const obtenerUsuarioPorcorreo = async(correo) => {
    const [rows] = await connection.query(`SELECT * FROM usuarios WHERE LOWER(TRIM(correo)) = ?`,
        [correo.trim().toLowerCase()]
    );

    if(rows.length === 0) return null;
    if (rows.length > 1) throw new AppError("Hay cuentas con correos equivalentes. Un administrador debe resolver el duplicado antes de continuar.", 409);
    return rows[0];
}

// Se crea usuarios
const crearUsuarios = async ({nombre,correo,password}) => 
{  
    const [result] = await connection.query(`INSERT INTO usuarios (nombre,correo,password,role) VALUES (?,?,?,'user')`,
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

