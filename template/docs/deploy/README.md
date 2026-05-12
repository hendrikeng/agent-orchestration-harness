# Deployment Model

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Deployment Contract

- Document runtime/deployment topology and environment promotion flow.
- Keep CI/CD implementation details in `.github/workflows`.
- Keep operational runbooks in `docs/ops/README.md` and linked runbooks.
- Keep release policy in `docs/ops/releases/README.md`.
- Keep project-specific deploy gates in `docs/governance/project-gates.json`.

Deployment docs describe how shipped code reaches users. They must not contain secrets, private credentials, raw tokens, or environment-specific values that belong in protected environment systems.

## Required Model

Record these details when the adopted project has them:

- Environments: local, preview, staging, production, and any customer- or region-specific environments.
- Promotion flow: source branch, release branch, tag, build artifact, deploy trigger, approval point, and rollback or fix-forward path.
- Deployables: web apps, APIs, workers, scheduled jobs, CLIs, migrations, static assets, and infrastructure changes.
- Runtime ownership: service owner, on-call or escalation owner, operational dashboard, and incident channel.
- Configuration: required environment variables by name, secret owner, rotation expectation, and validation command.
- Data changes: migration, backfill, repair, replay, and rollback requirements.
- Verification: smoke tests, health checks, synthetic checks, browser checks, release checks, and deployment verification command.

## Release And Deploy Gates

- `npm run verify:fast` must pass before a deployment candidate is treated as reviewable.
- `npm run verify:full` must pass before merge or release unless the project documents a narrower emergency path.
- `npm run release:verify` applies when release support is enabled.
- `npm run verify:deploy` applies when the project has deployment verification wired.
- Any skipped gate needs an owner, reason, expiry, and follow-up.

## Safety Rules

- Do not claim deployment success from build success alone.
- Do not run production-affecting deploys, migrations, repairs, or backfills without explicit target, approval, and rollback or fix-forward notes.
- Do not hide partial deployment failure behind a green final status; record the affected deployable and recovery path.
- Prefer immutable build artifacts and repeatable deployment commands over manual console changes.
- Deployment changes that alter runtime topology must update `docs/architecture/TOPOLOGY.md` in the same slice.
