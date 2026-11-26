import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ quiet: true });
const email = process.argv[2];
if (!email) throw new Error('Indica el correo de una cuenta existente.');
let connection;
let locked = false;
let transaction = false;
try {
    connection = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectTimeout: 5000 });
    const [[lock]] = await connection.query('SELECT GET_LOCK(?, 10) AS acquired', ['gym:admin-assignment']);
    if (Number(lock.acquired) !== 1) throw new Error('Otra asignación administrativa está en curso.');
    locked = true;
    const [[table]] = await connection.query("SELECT ENGINE AS engine FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios'");
    if (table?.engine !== 'InnoDB') throw new Error('La tabla usuarios debe soportar transacciones InnoDB para esta asignación.');
    await connection.beginTransaction(); transaction = true;
    const [users] = await connection.query('SELECT id FROM usuarios WHERE correo = ? FOR UPDATE', [email]);
    if (users.length !== 1) throw new Error('No se encontró una cuenta única con ese correo. No se realizaron cambios.');
    const id = users[0].id;
    await connection.query("UPDATE usuarios SET role = 'user' WHERE role = 'admin' AND id <> ?", [id]);
    await connection.query("UPDATE usuarios SET role = 'admin' WHERE id = ?", [id]);
    const [[count]] = await connection.query("SELECT COUNT(*) AS total FROM usuarios WHERE role = 'admin'");
    if (Number(count.total) !== 1) throw new Error('No se pudo asegurar un único administrador.');
    await connection.commit(); transaction = false;
    console.log('Cuenta indicada configurada como el único administrador.');
} catch (error) {
    if (transaction) await connection.rollback();
    console.error(error.code ? `Error de conexión o base de datos: ${error.code}` : error.message);
    process.exitCode = 1;
} finally {
    if (locked) await connection.query('SELECT RELEASE_LOCK(?)', ['gym:admin-assignment']);
    if (connection) await connection.end();
}
