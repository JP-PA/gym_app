export async function findRecoveryAccount(connection, email) {
    const [rows] = await connection.query('SELECT id FROM usuarios WHERE correo = ? FOR UPDATE', [email]);
    return rows;
}

export async function replacePassword(connection, id, hash) {
    const [result] = await connection.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, id]);
    return result.affectedRows === 1;
}
