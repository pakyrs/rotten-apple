// ─────────────────────────────────────────────────────────────
// Tests. These use Node's BUILT-IN test runner (node:test), so we
// don't have to install Jest or anything — one less thing to break.
//
// The CI pipeline runs this file. If any test fails, the pipeline
// goes red and (with branch protection on) blocks the merge.
//
// TRY THIS LATER: break app.js on purpose (e.g. make add return a-b)
// and watch the pipeline catch it.
// ─────────────────────────────────────────────────────────────

const { test } = require('node:test');
const assert = require('node:assert');
const { add, greet, health } = require('../src/app');

test('add() sums two numbers', () => {
  assert.strictEqual(add(2, 3), 5);
});

test('add() handles negatives', () => {
  assert.strictEqual(add(-4, 1), -3);
});

test('greet() builds a greeting', () => {
  assert.strictEqual(greet('Sam'), 'Hello, Sam!');
});

test('greet() throws when name is missing', () => {
  assert.throws(() => greet(), /name is required/);
});

test('health() reports ok', () => {
  assert.strictEqual(health().status, 'ok');
});
