import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePagination, queryPage } from '../src/utils/pagination.js';

test('pagination is opt-in and supplies defaults for missing parameters', () => {
    assert.equal(parsePagination({}), null);
    assert.deepEqual(parsePagination({ page: '2' }), { page: 2, limit: 10 });
    assert.deepEqual(parsePagination({ limit: '25' }), { page: 1, limit: 25 });
});

test('rejects invalid values before SQL execution', () => {
    for (const query of [{ page: '0' }, { page: '-1' }, { limit: '101' }, { limit: '0' }, { page: '1.5' }, { page: '1 OR 1=1' }, { page: ['1', '2'] }, { limit: {} }, { page: '1000001' }]) {
        assert.throws(() => parsePagination(query), error => error.statusCode === 400);
    }
});

for (const { total, requested, expected, offset } of [
    { total: 23, requested: 2, expected: 2, offset: 10 },
    { total: 23, requested: 99, expected: 3, offset: 20 },
    { total: 0, requested: 4, expected: 1, offset: 0 }
]) {
    test(`returns correct metadata and parameterized offset for total=${total}, page=${requested}`, async () => {
        const calls = [];
        const connection = { query: async (sql, values) => {
            calls.push({ sql, values });
            return calls.length === 1 ? [[{ total: String(total) }]] : [[{ id: 5 }]];
        } };
        const result = await queryPage(connection, 'SELECT id FROM usuarios', 'SELECT COUNT(*) AS total FROM usuarios', 'id DESC', { page: requested, limit: 10 });
        assert.deepEqual(result.pagination, { page: expected, limit: 10, total, totalPages: Math.ceil(total / 10) });
        assert.deepEqual(calls[1], { sql: 'SELECT id FROM usuarios ORDER BY id DESC LIMIT ? OFFSET ?', values: [10, offset] });
    });
}
