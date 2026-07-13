// ─────────────────────────────────────────────────────────────
// This is our "application". It's deliberately tiny — just a few
// functions — because the point isn't the app, it's watching the
// pipeline build it, test it, and "deploy" it.
// ─────────────────────────────────────────────────────────────

// A couple of simple functions the tests will check.
function add(a, b) {
  return a + b;
}

function greet(name) {
  if (!name) {
    throw new Error('name is required');
  }
  return `Hello, ${name}!`;
}

// A fake "health check" the deploy step will call to prove the app is alive.
function health() {
  return { status: 'ok', time: new Date().toISOString() };
}

module.exports = { add, greet, health };
