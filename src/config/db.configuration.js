// se importa el module de mysql2
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

//conexion a base de datos mysql
const db = mysql.createPool({
host : process.env.DB_HOST,
user : process.env.DB_USER,
password : process.env.DB_PASSWORD,
database : process.env.DB_NAME,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
})

db.getConnection((err,connection)=>{
    if(err){console.error("error al conectar a la base de datos",err); return}

    else{console.log("conectado a mysql")}
    connection.release()
});

export default db;


