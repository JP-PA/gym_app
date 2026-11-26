import test from 'node:test';
import assert from 'node:assert/strict';
import { crearProductoSchema } from '../src/validators/producto.validator.js';
import { crearVentaSchema } from '../src/validators/venta.validator.js';
import { crearMembresiaSchema, actualizarMembresiaSchema } from '../src/validators/membresia.validator.js';
import { crearUsuarioSchema, actualizarUsuarioSchema, loginUsuarioSchema } from '../src/validators/usuario.validator.js';
import { saveSale } from '../src/utils/saleTransaction.js';

test('product accepts zero stock and normalizes numeric form values', () => {
    const { value, error } = crearProductoSchema.validate({ nombre: ' Agua ', precio: '2500', stock: '0' });
    assert.equal(error, undefined);
    assert.deepEqual(value, { nombre: 'Agua', precio: 2500, stock: 0 });
    for (const patch of [{ precio: -1 }, { stock: -1 }, { stock: 1.5 }, { nombre: '' }]) {
        assert.ok(crearProductoSchema.validate({ nombre: 'Agua', precio: 2500, stock: 5, ...patch }).error);
    }
});

test('sale rejects empty, fractional, negative quantities and client supplied prices', () => {
    for (const productos of [[], [{ producto_id: 1, cantidad: 0 }], [{ producto_id: 1, cantidad: 1.5 }], [{ producto_id: 1, cantidad: -1 }], [{ producto_id: 1, cantidad: 1, precio: 1 }]]) {
        assert.ok(crearVentaSchema.validate({ usuario_id: 1, productos }).error);
    }
    assert.equal(crearVentaSchema.validate({ usuario_id: 1, productos: [{ producto_id: 1, cantidad: 2 }] }).error, undefined);
});

test('membership restricts plans and requires an existing positive client ID shape', () => {
    assert.equal(crearMembresiaSchema.validate({ tipo: 'mensual', precio: 80000, usuario_id: 1 }).error, undefined);
    assert.ok(crearMembresiaSchema.validate({ tipo: 'otro', precio: 80000, usuario_id: 1 }).error);
    assert.ok(crearMembresiaSchema.validate({ tipo: 'mensual', precio: 80000, usuario_id: -1 }).error);
});

test('client requires an email and a strong password', () => {
    assert.ok(crearUsuarioSchema.validate({ nombre: 'Cliente Prueba', correo: 'invalid', password: 'short' }).error);
    assert.equal(crearUsuarioSchema.validate({ nombre: 'Cliente Prueba', correo: 'cliente@example.com', password: 'Testing123!' }).error, undefined);
});

function fixture({ missingUser = false, failDetail = false, stock = 10 } = {}) {
    const calls = [];
    const connection = Object.fromEntries(['beginTransaction', 'commit', 'rollback', 'release'].map(method => [method, async () => calls.push(method)]));
    const models = {
        obtenerUsuario: async (id, db) => { assert.equal(db, connection); return missingUser ? null : { id }; },
        obtenerProductoPorId: async (id, db) => { assert.equal(db, connection); calls.push(`lock:${id}`); return { id, nombre: 'Producto', precio: '0.10', stock }; },
        crearVenta: async (db, data) => { assert.equal(db, connection); calls.push({ sale: data }); return { id: 7 }; },
        crearDetalleVenta: async (db, data) => { assert.equal(db, connection); if (failDetail) throw new Error('simulated failure'); calls.push({ detail: data }); },
        actualizarStockProducto: async (db, data) => { assert.equal(db, connection); calls.push({ stock: data }); }
    };
    return { calls, connection, models };
}

test('sale aggregates duplicate products, locks in order and calculates decimal totals on the server', async () => {
    const { calls, connection, models } = fixture();
    const result = await saveSale(connection, { usuario_id: 1, productos: [{ producto_id: 2, cantidad: 1 }, { producto_id: 1, cantidad: 2 }, { producto_id: 2, cantidad: 2 }] }, models);
    assert.equal(result.total, 0.5);
    assert.deepEqual(calls.filter(call => typeof call === 'string'), ['beginTransaction', 'lock:1', 'lock:2', 'commit', 'release']);
    const details = calls.filter(call => call.detail).map(call => call.detail);
    assert.deepEqual(details.map(detail => detail.cantidad), [2, 3]);
    assert.equal(details[1].subtotal, 0.3);
});

for (const config of [{ missingUser: true }, { stock: 1 }, { failDetail: true }]) {
    test(`rolls back and releases the connection on failure ${JSON.stringify(config)}`, async () => {
        const { calls, connection, models } = fixture(config);
        await assert.rejects(saveSale(connection, { usuario_id: 1, productos: [{ producto_id: 1, cantidad: 2 }] }, models));
        assert.ok(!calls.includes('commit'));
        assert.deepEqual(calls.slice(-2), ['rollback', 'release']);
    });
}


test('product and membership prices fit the actual DECIMAL(10,2) columns', () => {
    assert.ok(crearProductoSchema.validate({ nombre: 'Agua', precio: 100000000, stock: 0 }).error);
    assert.ok(crearMembresiaSchema.validate({ tipo: 'mensual', precio: 100000000, usuario_id: 1 }).error);
});

test('password validation errors never include the submitted password', () => {
    const password = 'weakpass';
    const { error } = crearUsuarioSchema.validate({ nombre: 'Cliente Prueba', correo: 'cliente@example.com', password });
    assert.ok(error);
    assert.ok(!error.message.includes(password));
});


test('renewal validates plan and price and rejects client reassignment', () => {
    assert.equal(actualizarMembresiaSchema.validate({ tipo: 'anual', precio: 200000 }).error, undefined);
    for (const input of [{ tipo: 'otro', precio: 1 }, { tipo: 'mensual', precio: 0 }, { tipo: 'mensual' }, { tipo: 'mensual', precio: 1, usuario_id: 2 }]) {
        assert.ok(actualizarMembresiaSchema.validate(input).error);
    }
});


test('registration, update and login normalize the same email identity', () => {
    const correo = ' CLIENTE@EXAMPLE.COM ';
    for (const [schema, body] of [[crearUsuarioSchema, { nombre: 'Cliente Prueba', correo, password: 'Testing123!' }], [actualizarUsuarioSchema, { correo }], [loginUsuarioSchema, { correo, password: 'Testing123!' }]]) {
        const result = schema.validate(body);
        assert.equal(result.error, undefined);
        assert.equal(result.value.correo, 'cliente@example.com');
    }
});
