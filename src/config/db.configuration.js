// se importa el module de mysql2
const mysql = require("mysql2");
require("dotenv").config();

//conexion a base de datos mysql
const db = mysql.createConnection({
host : process.env.DB_HOST,
user : process.env.DB_USER,
password : process.env.DB_PASSWORD,
database : process.env.DB_NAME
})

db.connect((err)=>{
    if(err){console.error("error al conectar a la base de datos",err); return}

    else{console.log("conectado a mysql")}
});

module.exports = db;


