// ─────────────────────────────────────────────────────────────
// A pretend "build". A real build would bundle/compile your app;
// ours just copies the source into a dist/ folder and writes a
// version file. That's enough to produce an ARTIFACT the pipeline
// can hand from one stage to the next.
// ─────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
fs.mkdirSync(dist, { recursive: true });

// Copy the app in.
fs.copyFileSync(
  path.join(__dirname, '..', 'src', 'app.js'),
  path.join(dist, 'app.js')
);

// Write a little build-info file so we can prove the deploy shipped THIS build.
const info = {
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local',
};
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify(info, null, 2));

console.log('Build complete →', dist);
