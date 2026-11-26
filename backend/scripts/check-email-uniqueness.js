import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ quiet: true });
let connection;
try {
    connection = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectTimeout: 5000 });
    const [indexes] = await connection.query("SELECT INDEX_NAME, NON_UNIQUE, COLUMN_NAME, SEQ_IN_INDEX FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' ORDER BY INDEX_NAME, SEQ_IN_INDEX");
    console.log('Índices:', JSON.stringify(indexes));
    const [duplicates] = await connection.query('SELECT COUNT(*) AS groups_with_duplicates FROM (SELECT LOWER(TRIM(correo)) AS email FROM usuarios WHERE correo IS NOT NULL GROUP BY LOWER(TRIM(correo)) HAVING COUNT(*) > 1) AS duplicates');
    console.log('Grupos de correos duplicados al normalizar:', duplicates[0].groups_with_duplicates);
    if (process.argv[2]) {
        const [accounts] = await connection.query('SELECT id, correo, role, CHAR_LENGTH(correo) AS longitud FROM usuarios WHERE LOWER(TRIM(correo)) = LOWER(TRIM(?)) ORDER BY id', [process.argv[2]]);
        console.log('Cuentas que coinciden con el correo indicado:', JSON.stringify(accounts));
    }
} catch (error) { console.error('No se pudo verificar MySQL:', error.code || 'ERROR'); process.exitCode = 1; }
finally { if (connection) await connection.end(); }
