# rotten-apple

A web app that deploys to Azure App Service via a GitHub Actions pipeline.
It connects to Postgres (password via Key Vault reference) and sits behind
an Application Gateway.

## The pipeline

- `.github/workflows/ci.yml` — on every pull request: install, lint, test.
  Branch protection blocks the merge until this passes.
- `.github/workflows/cd.yml` — on merge to main: build a package, wait for
  approval on the `production` environment, log into Azure with OIDC,
  deploy to the App Service, and smoke-test the live /health endpoint.

## One-time setup before the pipeline can deploy

1. Create the OIDC federated credential in Azure (see the chat instructions),
   scoped to `repo:<owner>/rotten-apple:ref:refs/heads/main`, and give its
   identity Contributor on your resource group.
2. Add three repo VARIABLES (Settings > Secrets and variables > Actions > Variables):
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`
3. Set `AZURE_WEBAPP_NAME` in cd.yml to your App Service name.
4. Create a `production` GitHub Environment with a required reviewer (needs a
   public repo or Enterprise) for the approval gate.

## The app

- `GET /health` — liveness check, no DB. Used by the smoke test.
- `GET /seed` — creates and populates a demo `visitors` table.
- `GET /` — lists the rows.

Database config comes from App Service settings; `DATABASE_PASSWORD` is a
Key Vault reference resolved at runtime by the App Service managed identity.
