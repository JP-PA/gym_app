import bcrypt from 'bcryptjs';
import { crearUsuarioSchema } from '../validators/usuario.validator.js';
import { findRecoveryAccount, replacePassword } from '../models/passwordRecovery.model.js';

export async function resetPassword(connection, email, password, confirmation) {
    if (password !== confirmation) throw new Error('Las contraseñas no coinciden. No se realizaron cambios.');
    const { error } = crearUsuarioSchema.extract('password').validate(password);
    if (error) throw new Error('Usa de 8 a 40 caracteres, con mayúscula, minúscula, número y símbolo.');
    const hash = await bcrypt.hash(password, 10);
    await connection.beginTransaction();
    try {
        const accounts = await findRecoveryAccount(connection, email);
        if (accounts.length !== 1) throw new Error('No se encontró una cuenta única con ese correo.');
        if (!await replacePassword(connection, accounts[0].id, hash)) throw new Error('No se pudo actualizar la contraseña.');
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}
