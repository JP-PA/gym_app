import test from 'node:test';
import assert from 'node:assert/strict';
import { parseListQuery, buildFilters, queryFilteredPage } from '../src/utils/listFilters.js';

test('keeps legacy requests unpaginated and paginates filtered requests with defaults', () => {
    assert.equal(parseListQuery({}, 'users'), null);
    assert.equal(parseListQuery({ q: '   ' }, 'users'), null);
    assert.deepEqual(parseListQuery({ q: ' Juan ' }, 'users'), { page: 1, limit: 10, filters: { q: 'Juan' } });
    assert.deepEqual(parseListQuery({}, 'personalMemberships', true), { page: 1, limit: 10, filters: {} });
});

test('rejects invalid calendar dates, reversed ranges, invalid enums and non scalar values', () => {
    const cases = [
        ['memberships', { fechaDesde: '2026-02-30' }],
        ['memberships', { fechaHasta: '2025-02-29' }],
        ['memberships', { fechaDesde: '2026-11-18', fechaHasta: '2026-11-01' }],
        ['products', { precioMin: 100, precioMax: 50 }],
        ['sales', { totalMin: -1 }],
        ['memberships', { estado: 'invalid' }],
        ['memberships', { fechaCampo: 'm.fecha_fin; DROP TABLE usuarios' }],
        ['users', { q: ['a', 'b'] }],
        ['products', { stock: 'anything' }],
        ['users', { q: 'a'.repeat(101) }]
    ];
    for (const [resource, query] of cases) assert.throws(() => parseListQuery(query, resource), error => error.statusCode === 400);
    assert.equal(parseListQuery({ fechaDesde: '2024-02-29' }, 'sales').filters.fechaDesde, '2024-02-29');
});

test('text values never enter SQL and literal SQL wildcard characters are escaped', () => {
    const payload = "x%' OR 1=1 --_!";
    const filter = buildFilters('users', { q: payload });
    assert.ok(!filter.sql.includes(payload));
    assert.equal(filter.params.length, 2);
    assert.equal(filter.params[0], "%x!%' OR 1=1 --!_!!%");
    assert.ok(filter.sql.includes("ESCAPE '!'"));
});

test('membership filters combine client, plan, computed state, dates and price', () => {
    const result = buildFilters('memberships', { q: 'Juan', tipo: 'mensual', estado: 'vencida', fechaCampo: 'inicio', fechaDesde: '2026-01-01', fechaHasta: '2026-11-18', precioMin: 0, precioMax: 80000 });
    assert.ok(result.sql.includes('m.fecha_fin < CURDATE()'));
    assert.ok(result.sql.includes('m.fecha_inicio >= ?'));
    assert.ok(result.sql.includes("m.fecha_inicio <= CONCAT(?, ' 23:59:59.999999')"));
    assert.deepEqual(result.params, ['%Juan%', '%Juan%', 0, 80000, 'mensual', '2026-01-01', '2026-11-18']);
    assert.ok(buildFilters('memberships', { fechaDesde: '2026-01-01' }).sql.includes('m.fecha_fin >= ?'));
});

test('zero amounts and no-stock products are valid filters', () => {
    const result = buildFilters('products', { precioMin: 0, precioMax: 0, stock: 'agotado' });
    assert.deepEqual(result.params, [0, 0]);
    assert.ok(result.sql.includes('p.stock = 0'));
});

test('ownership always restricts personal lists even when a query supplies another user ID', () => {
    const options = parseListQuery({ usuario_id: '99', q: 'Agua', totalMin: '0' }, 'personalPurchases', true);
    assert.equal(options.filters.usuario_id, undefined);
    const result = buildFilters('personalPurchases', options.filters, 2);
    assert.ok(result.sql.startsWith(' WHERE v.usuario_id = ? AND ('));
    assert.equal(result.params[0], 2);
    assert.ok(result.sql.includes('dv.venta_id = v.id'));
    assert.throws(() => buildFilters('personalMemberships', {}, undefined), error => error.statusCode === 401);
});

test('count and page queries share exactly the same conditions and filter values', async () => {
    const calls = [];
    const db = { query: async (sql, values) => { calls.push({ sql, values }); return calls.length === 1 ? [[{ total: 13 }]] : [[{ id: 7 }]]; } };
    const options = parseListQuery({ q: 'Agua', precioMin: '100', page: '2', limit: '10' }, 'products');
    const result = await queryFilteredPage(db, 'products', 'SELECT p.*', 'FROM productos p', 'p.id DESC', options);
    assert.equal(result.pagination.total, 13);
    assert.equal(result.pagination.page, 2);
    assert.equal(calls[0].sql.split(' WHERE ')[1], calls[1].sql.split(' WHERE ')[1].split(' ORDER BY ')[0]);
    assert.deepEqual(calls[0].values, ['%Agua%', 100]);
    assert.deepEqual(calls[1].values, ['%Agua%', 100, 10, 10]);
});

test('timestamp final-day filter includes purchases throughout that day', () => {
    const result = buildFilters('sales', { fechaDesde: '2026-11-01', fechaHasta: '2026-11-18', totalMin: 1, totalMax: 10 });
    assert.ok(result.sql.includes("v.fecha <= CONCAT(?, ' 23:59:59.999999')"));
    assert.deepEqual(result.params, [1, 10, '2026-11-01', '2026-11-18']);
});
