import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { resetPassword } from '../src/services/passwordRecovery.service.js';

dotenv.config({ quiet: true });
function readHidden(prompt) {
    return new Promise((resolve, reject) => {
        const silent = new Writable({ write(chunk, encoding, callback) { callback(); } });
        const rl = createInterface({ input: process.stdin, output: silent, terminal: true, historySize: 0 });
        process.stdout.write(prompt);
        rl.once('SIGINT', () => { rl.close(); process.stdout.write('\n'); reject(new Error('Operación cancelada.')); });
        rl.once('close', () => reject(new Error('Entrada cerrada.')));
        rl.question('', answer => { resolve(answer); rl.close(); process.stdout.write('\n'); });
    });
}

let connection;
try {
    const email = process.argv[2];
    if (!email || process.argv.length !== 3) throw new Error('Uso: node scripts/reset-password.js correo-de-la-cuenta');
    if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Ejecuta este comando en una terminal interactiva. No pases la contraseña como argumento ni por una tubería.');
    console.log('Se actualizará únicamente la contraseña; el rol y los datos de la cuenta se conservan.');
    const password = await readHidden('Nueva contraseña (entrada oculta): ');
    const confirmation = await readHidden('Confirma la contraseña: ');
    connection = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectTimeout: 5000 });
    await resetPassword(connection, email, password, confirmation);
    console.log('Contraseña restablecida. Ya puedes iniciar sesión con la nueva contraseña.');
} catch (error) {
    console.error(error.code ? `Error de conexión o base de datos: ${error.code}` : error.message);
    process.exitCode = 1;
} finally {
    if (connection) await connection.end();
}
