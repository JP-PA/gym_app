import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
const users = [{ id: 1, nombre: 'Admin', correo: 'admin@example.com', role: 'admin' }, { id: 2, nombre: 'Cliente', correo: 'cliente@example.com', role: 'user' }, { id: 3, nombre: 'Otro', correo: 'otro@example.com', role: 'user' }];
const memberships = [{ id: 10, usuario_id: 2, tipo: 'mensual', estado: 'activa' }, { id: 11, usuario_id: 3, tipo: 'anual', estado: 'activa' }];
const purchases = [{ id: 20, usuario_id: 2, total: 100 }, { id: 21, usuario_id: 3, total: 200 }];
let detailQueries = 0;
const pool = { promise: () => ({ query: async (sql, params = []) => {
    const query = sql.replace(/\s+/g, ' ');
    if (query.includes('FROM usuarios WHERE LOWER(TRIM(correo))')) return [[{ id: 1, correo: 'admin@example.com', role: 'admin', password: null }]];
    if (query.includes('FROM usuarios WHERE id')) return [users.filter(user => user.id === params[0])];
    if (query.includes('WHERE id = ? AND usuario_id = ?')) return [purchases.filter(sale => sale.id === params[0] && sale.usuario_id === params[1])];
    if (query.includes('FROM detalle_ventas')) { detailQueries++; return [[{ nombre: 'Agua', cantidad: 1, subtotal: 100 }]]; }
    const collection = query.includes('FROM membresias m WHERE m.usuario_id = ?') ? memberships : query.includes('FROM ventas v WHERE v.usuario_id = ?') ? purchases : null;
    if (collection) {
        const own = collection.filter(row => row.usuario_id === params[0]);
        if (query.includes('COUNT(*)')) return [[{ total: own.length }]];
        return [own.slice(params[2], params[2] + params[1])];
    }
    throw new Error('Unexpected SQL in access test');
} }), getConnection: callback => callback(null, { release() {} }) };
globalThis.__accessPool = pool;
const hooks = registerHooks({
    resolve(specifier, context, next) { return specifier === 'mysql2' ? { url: 'test:mysql-access', shortCircuit: true } : next(specifier, context); },
    load(url, context, next) { return url === 'test:mysql-access' ? { format: 'module', source: 'export default {createPool:()=>globalThis.__accessPool}', shortCircuit: true } : next(url, context); }
});
const routers = {};
for (const name of ['usuarios', 'productos', 'membresias', 'ventas', 'personal']) routers[name] = (await import(`../src/routes/${name}.routes.js`)).default;
hooks.deregister();
const token = (id, role = 'user', options = {}) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h', ...options });
function call(router, { url = '/', method = 'GET', auth, query = {}, body = {} } = {}) {
    return new Promise((resolve, reject) => {
        const req = { url, method, query, body, headers: auth ? { authorization: `Bearer ${auth}` } : {} };
        const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, data }); } };
        router.handle(req, res, error => error ? resolve({ status: error.statusCode || 500, data: { message: error.message } }) : reject(new Error('Route not matched')));
    });
}

test('anonymous requests and ordinary users cannot enter any administrative router', async () => {
    for (const name of ['usuarios', 'productos', 'membresias', 'ventas']) {
        assert.equal((await call(routers[name])).status, 401);
        for (const method of ['GET', 'PUT', 'DELETE']) {
            assert.equal((await call(routers[name], { url: method === 'GET' ? '/' : '/1', method, auth: token(2) })).status, 403);
        }
        if (name !== 'usuarios') assert.equal((await call(routers[name], { method: 'POST', auth: token(2) })).status, 403);
    }
});

test('database role overrides the token role and role changes take effect immediately', async () => {
    assert.equal((await call(routers.productos, { method: 'POST', auth: token(2, 'admin') })).status, 403);
    const adminToken = token(1, 'user');
    // Authorization passes; an empty product then fails validation, instead of returning 403.
    assert.equal((await call(routers.productos, { method: 'POST', auth: adminToken })).status, 400);
    users[0].role = 'user';
    try { assert.equal((await call(routers.productos, { method: 'POST', auth: adminToken })).status, 403); }
    finally { users[0].role = 'admin'; }
});

test('expired, tampered and deleted-account sessions are rejected', async () => {
    for (const auth of [token(2, 'user', { expiresIn: -1 }), token(99), token(2) + 'invalid']) {
        assert.equal((await call(routers.personal, { url: '/perfil', auth })).status, 401);
    }
});

test('public registration rejects role escalation', async () => {
    const result = await call(routers.usuarios, { method: 'POST', body: { nombre: 'Cliente Prueba', correo: 'new@example.com', password: 'Testing123!', role: 'admin' } });
    assert.equal(result.status, 400);
});

test('personal profile and paginated lists always use session identity', async () => {
    const auth = token(2);
    const profile = await call(routers.personal, { url: '/perfil', auth });
    assert.equal(profile.data.id, 2);
    assert.equal(profile.data.password, undefined);
    for (const url of ['/membresias', '/compras']) {
        const result = await call(routers.personal, { url, auth, query: { usuario_id: '3', page: '1', limit: '10' } });
        assert.equal(result.status, 200);
        assert.equal(result.data.pagination.total, 1);
        assert.ok(result.data.data.every(row => row.usuario_id === 2));
    }
});

test('purchase details cannot be read by another owner and never query their line items', async () => {
    const before = detailQueries;
    assert.equal((await call(routers.personal, { url: '/compras/21', auth: token(2) })).status, 404);
    assert.equal(detailQueries, before);
    const own = await call(routers.personal, { url: '/compras/20', auth: token(2) });
    assert.equal(own.status, 200);
    assert.equal(own.data.productos[0].nombre, 'Agua');
});


test('login with a NULL password returns a credential error rather than a server error', async () => {
    const result = await call(routers.usuarios, { url: '/login', method: 'POST', body: { correo: 'admin@example.com', password: 'Testing123!' } });
    assert.equal(result.status, 401);
    assert.equal(result.data.message, 'Correo o contraseña incorrectos');
});
