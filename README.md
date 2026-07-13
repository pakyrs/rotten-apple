# learn-cicd

A tiny project for learning how a CI/CD pipeline works, using GitHub Actions.
Nothing here costs money and there's no real cloud — the "deploy" steps are mocked.

## What's inside

- `src/app.js` — a tiny "app" (a few functions)
- `test/app.test.js` — tests for it
- `scripts/build.js` — a pretend build that makes a `dist/` folder
- `.github/workflows/ci.yml` — runs on pull requests: lint, test, build
- `.github/workflows/cd.yml` — runs on merges to main: build → staging → approval → production

## The idea

1. Open a pull request → **CI** runs and must pass before you can merge.
2. Merge to `main` → **CD** runs: it deploys to staging, waits for you to
   approve, then promotes to production.

## Try this to see the pipeline catch a bug

Edit `src/app.js` so `add` returns `a - b`, open a PR, and watch CI go red.
