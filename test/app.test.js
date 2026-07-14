// ─────────────────────────────────────────────────────────────
// Tests run in CI on every pull request. They test the pieces that
// DON'T need a real database — the health check and the module's
// shape — so CI stays fast and needs no DB connection.
//
// The database itself is verified by the pipeline's post-deploy
// smoke test against the live /health endpoint, not here.
// ─────────────────────────────────────────────────────────────

const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

test('health() reports ok', () => {
  assert.strictEqual(app.health().status, 'ok');
});

test('health() includes a timestamp', () => {
  assert.ok(app.health().time);
});

test('module exports the handler and client factory', () => {
  assert.strictEqual(typeof app.handle, 'function');
  assert.strictEqual(typeof app.makeClient, 'function');
});
