import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import bcrypt from 'bcryptjs';

// Exercise real controllers, services and SQL models without touching the configured database.
const state = { users: [], products: [], memberships: [], sales: [], details: [] };
const connection = {
    beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {},
    query: async (sql, values = []) => {
        const query = sql.replace(/\s+/g, ' ').trim();
        if (query.startsWith('SELECT * FROM usuarios WHERE LOWER(TRIM(correo))')) return [state.users.filter(user => user.correo.trim().toLowerCase() === values[0])];
        if (query.includes('FROM usuarios WHERE id')) return [state.users.filter(user => user.id === values[0])];
        if (query.includes('FROM productos WHERE id')) return [state.products.filter(product => product.id === values[0])];
        if (query.includes('FROM membresias m') && query.includes('WHERE m.id = ?')) {
            return [state.memberships.filter(item => item.id === values[0])];
        }
        if (query.startsWith('UPDATE membresias')) {
            assert.ok(query.includes('WHERE id = ? AND fecha_fin < CURDATE()'));
            assert.ok(query.includes('DATE_ADD(CURDATE(), INTERVAL ? DAY)'));
            const item = state.memberships.find(row => row.id === values[3] && row.estado === 'vencida');
            if (!item || state.concurrentRenewal) return [{ affectedRows: 0 }];
            Object.assign(item, { tipo: values[0], precio: values[1], dias: values[2], estado: 'activa' });
            return [{ affectedRows: 1 }];
        }
        if (query.startsWith('INSERT INTO usuarios')) {
            if (state.duplicateInsert) throw Object.assign(new Error('duplicate'), { code: 'ER_DUP_ENTRY' });
            state.users.push({ id: 1, nombre: values[0], correo: values[1], password: values[2] });
            return [{ insertId: 1, affectedRows: 1 }];
        }
        if (query.startsWith('UPDATE usuarios')) {
            Object.assign(state.users.find(user => user.id === values[3]), { nombre: values[0], correo: values[1], password: values[2] });
            return [{ affectedRows: 1 }];
        }
        if (query.startsWith('INSERT INTO productos')) {
            state.products.push({ id: 1, nombre: values[0], precio: values[1], stock: values[2] });
            return [{ insertId: 1, affectedRows: 1 }];
        }
        if (query.startsWith('INSERT INTO membresias')) { state.memberships.push(values); return [{ insertId: 1, affectedRows: 1 }]; }
        if (query.startsWith('INSERT INTO ventas')) { state.sales.push(values); return [{ insertId: 1, affectedRows: 1 }]; }
        if (query.startsWith('INSERT INTO detalle_ventas')) { state.details.push(values); return [{ insertId: 1, affectedRows: 1 }]; }
        if (query.startsWith('UPDATE productos')) {
            const product = state.products.find(item => item.id === values[1]);
            assert.equal(values[0], values[2]);
            if (!product || product.stock < values[0]) return [{ affectedRows: 0 }];
            product.stock -= values[0]; return [{ affectedRows: 1 }];
        }
        throw new Error('Unexpected SQL in creation flow');
    }
};
globalThis.__creationTestPool = {
    promise: () => ({ query: connection.query, getConnection: async () => connection }),
    getConnection: callback => callback(null, connection)
};
const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier === 'mysql2') return { url: 'test:mysql2', shortCircuit: true };
        return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
        if (url === 'test:mysql2') return { format: 'module', source: 'export default { createPool: () => globalThis.__creationTestPool };', shortCircuit: true };
        return nextLoad(url, context);
    }
});
const { crearUsuario, actualizarUsuario } = await import('../src/controllers/usuarios.controller.js');
const { crearProductos } = await import('../src/controllers/productos.controller.js');
const { crearMembresia, actualizarMembresia } = await import('../src/controllers/membresias.controller.js');
const { crearVentaController } = await import('../src/controllers/ventas.controller.js');
hooks.deregister();

function call(handler, body, params = {}) {
    return new Promise((resolve, reject) => {
        const response = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, data }); } };
        Promise.resolve(handler({ body, params }, response, reject)).catch(reject);
    });
}

test('all four creation flows reach SQL models and return usable HTTP payloads', async () => {
    const client = await call(crearUsuario, { nombre: 'Cliente Prueba', correo: 'cliente@example.com', password: 'Testing123!' });
    assert.equal(client.status, 201);
    assert.equal(client.data.data.id, 1);
    assert.equal(client.data.data.password, undefined);
    assert.ok(await bcrypt.compare('Testing123!', state.users[0].password));

    const product = await call(crearProductos, { nombre: 'Agua', precio: 2500, stock: 10 });
    assert.equal(product.status, 201);
    assert.equal(product.data.data.nombre, 'Agua');
    assert.equal(product.data.data.id, 1);

    const membership = await call(crearMembresia, { usuario_id: 1, tipo: 'mensual', precio: 80000 });
    assert.equal(membership.status, 201);
    assert.equal(membership.data.data.usuario_id, 1);
    assert.equal(state.memberships.length, 1);
    const days = Math.round((state.memberships[0][3] - state.memberships[0][2]) / 86400000);
    assert.equal(days, 30);

    const sale = await call(crearVentaController, { usuario_id: 1, productos: [{ producto_id: 1, cantidad: 2 }] });
    assert.equal(sale.status, 201);
    assert.equal(sale.data.total, 5000);
    assert.equal(state.products[0].stock, 8);
    assert.equal(state.sales.length, 1);
    assert.equal(state.details.length, 1);
    assert.deepEqual(state.details[0], [1, 1, 2, 2500, 5000]);
});


test('renews expired memberships through controller, service and parameterized SQL, preserving client and ID', async () => {
    for (const [tipo, days] of [['mensual', 30], ['trimestral', 90], ['semestral', 180], ['anual', 365]]) {
        const membership = { id: 50, usuario_id: 8, estado: 'vencida', tipo: 'mensual', precio: 100 };
        state.memberships = [membership];
        const result = await call(actualizarMembresia, { tipo, precio: 80000 }, { id: 50 });
        assert.equal(result.status, 200);
        assert.equal(result.data.data.estado, 'activa');
        assert.equal(membership.dias, days);
        assert.equal(membership.usuario_id, 8);
        assert.equal(membership.id, 50);
    }
});

test('rejects renewal of active or missing memberships', async () => {
    state.memberships = [{ id: 50, usuario_id: 8, estado: 'activa' }];
    await assert.rejects(call(actualizarMembresia, { tipo: 'mensual', precio: 80000 }, { id: 50 }), error => error.statusCode === 409);
    await assert.rejects(call(actualizarMembresia, { tipo: 'mensual', precio: 80000 }, { id: 99 }), error => error.statusCode === 404);
});

test('rejects a second renewal if another request already updated the row', async () => {
    state.memberships = [{ id: 50, usuario_id: 8, estado: 'vencida' }];
    state.concurrentRenewal = true;
    try {
        await assert.rejects(call(actualizarMembresia, { tipo: 'mensual', precio: 80000 }, { id: 50 }), error => error.statusCode === 409);
    } finally { state.concurrentRenewal = false; }
});


test('rejects duplicate email regardless of case and surrounding spaces', async () => {
    state.users = [{ id: 1, nombre: 'Cliente Prueba', correo: 'cliente@example.com', role: 'user' }];
    await assert.rejects(call(crearUsuario, { nombre: 'Otro Cliente', correo: ' CLIENTE@EXAMPLE.COM ', password: 'Testing123!' }), error => error.statusCode === 409);
    assert.equal(state.users.length, 1);
});

test('stores new emails in their canonical form', async () => {
    state.users = [];
    const result = await call(crearUsuario, { nombre: 'Cliente Prueba', correo: ' CLIENTE@EXAMPLE.COM ', password: 'Testing123!' });
    assert.equal(result.data.data.correo, 'cliente@example.com');
    assert.equal(state.users[0].correo, 'cliente@example.com');
});

test('handles the database uniqueness conflict when another request wins the insertion race', async () => {
    state.users = [];
    state.duplicateInsert = true;
    try { await assert.rejects(call(crearUsuario, { nombre: 'Cliente Prueba', correo: 'cliente@example.com', password: 'Testing123!' }), error => error.statusCode === 409); }
    finally { state.duplicateInsert = false; }
});

test('rejects assigning another account email during update', async () => {
    state.users = [{ id: 1, nombre: 'Cliente Uno', correo: 'uno@example.com', role: 'user' }, { id: 2, nombre: 'Cliente Dos', correo: 'dos@example.com', role: 'user' }];
    await assert.rejects(call(actualizarUsuario, { correo: ' DOS@EXAMPLE.COM ' }, { id: 1 }), error => error.statusCode === 409);
    assert.equal(state.users[0].correo, 'uno@example.com');
});

test('ambiguous legacy duplicates never select an arbitrary account', async () => {
    state.users = [{ id: 1, correo: 'cliente@example.com' }, { id: 2, correo: ' CLIENTE@example.com ' }];
    await assert.rejects(call(crearUsuario, { nombre: 'Cliente Prueba', correo: 'cliente@example.com', password: 'Testing123!' }), error => error.statusCode === 409);
});
