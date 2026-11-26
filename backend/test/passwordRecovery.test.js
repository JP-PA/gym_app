import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { resetPassword } from '../src/services/passwordRecovery.service.js';

function fixture({ found = true, fail = false } = {}) {
    const calls = [];
    let saved;
    const db = {
        beginTransaction: async () => calls.push('begin'),
        commit: async () => calls.push('commit'),
        rollback: async () => calls.push('rollback'),
        query: async (sql, params) => {
            if (sql.startsWith('SELECT')) { assert.equal(params[0], 'admin@example.com'); return [found ? [{ id: 4 }] : []]; }
            assert.equal(sql, 'UPDATE usuarios SET password = ? WHERE id = ?');
            assert.equal(params[1], 4);
            if (fail) throw new Error('Simulated write failure');
            saved = params[0];
            return [{ affectedRows: 1 }];
        }
    };
    return { db, calls, saved: () => saved };
}

test('replaces NULL password with a bcrypt hash without changing role or other columns', async () => {
    const { db, calls, saved } = fixture();
    await resetPassword(db, 'admin@example.com', 'Testing123!', 'Testing123!');
    assert.notEqual(saved(), 'Testing123!');
    assert.ok(await bcrypt.compare('Testing123!', saved()));
    assert.deepEqual(calls, ['begin', 'commit']);
});

test('rejects mismatched and weak passwords before modifying the database', async () => {
    for (const [password, confirmation] of [['Testing123!', 'different'], ['weakpass', 'weakpass']]) {
        const { db, calls } = fixture();
        await assert.rejects(resetPassword(db, 'admin@example.com', password, confirmation));
        assert.deepEqual(calls, []);
    }
});

for (const options of [{ found: false }, { fail: true }]) {
    test(`rolls back on failure ${JSON.stringify(options)}`, async () => {
        const { db, calls } = fixture(options);
        await assert.rejects(resetPassword(db, 'admin@example.com', 'Testing123!', 'Testing123!'));
        assert.deepEqual(calls, ['begin', 'rollback']);
    });
}
