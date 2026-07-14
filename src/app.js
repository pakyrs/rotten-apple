// ─────────────────────────────────────────────────────────────
// The real application. An HTTP server that:
//   - serves a health endpoint (used by the pipeline smoke test)
//   - connects to Postgres using config from environment / Key Vault
//   - has a /seed route to create + populate a demo table
// The DB password arrives via a Key Vault reference resolved by
// the App Service managed identity — the app just reads env vars.
// ─────────────────────────────────────────────────────────────

const http = require('http');
const { Client } = require('pg');

// Build a Postgres client from environment variables.
// In Azure these come from App Service settings; DATABASE_PASSWORD
// is a Key Vault reference resolved at runtime.
function makeClient() {
  return new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'postgres',
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });
}

// Health check — no DB needed. The pipeline hits this to confirm
// the app is alive after deploy.
function health() {
  return { status: 'ok', time: new Date().toISOString() };
}

// The request handler, exported so tests can call it without a real server.
async function handle(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/health') {
    res.end(JSON.stringify(health()));
    return;
  }

  // Everything else touches the database.
  const client = makeClient();
  try {
    await client.connect();

    if (req.url === '/seed') {
      await client.query(
        'CREATE TABLE IF NOT EXISTS visitors (id serial PRIMARY KEY, name text, seen timestamp DEFAULT now())'
      );
      await client.query("INSERT INTO visitors (name) VALUES ('Alice'), ('Bob')");
      res.end('Seeded! Visit / to see the rows.\n');
    } else {
      const result = await client.query('SELECT * FROM visitors ORDER BY id');
      let out = 'App Gateway -> App Service -> Postgres works!\n\nVisitors:\n';
      if (result.rows.length === 0) out += '  (empty - visit /seed once)\n';
      for (const row of result.rows) out += `  ${row.id}: ${row.name}\n`;
      res.end(out);
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('DB error: ' + err.message + '\n');
  } finally {
    await client.end().catch(() => {});
  }
}

// Only start a server when run directly (not when imported by tests).
if (require.main === module) {
  const port = process.env.PORT || 8080;
  http.createServer(handle).listen(port, () => {
    console.log('Listening on ' + port);
  });
}

module.exports = { health, handle, makeClient };
