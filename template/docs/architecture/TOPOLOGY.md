# Architecture Topology

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document and the repository app/package layout.

## Why This Exists

- Architecture docs must name the current runtime surfaces, shared packages, and transitional entrypoints.
- Repo-specific topology belongs here rather than being scattered across product docs or plan notes.
- Detailed app behavior docs may live elsewhere, but this file owns the structural map.

## What To Record

- Current deployable apps, APIs, workers, and internal surfaces.
- Shared packages or libraries that form canonical boundaries.
- Legacy or transitional surfaces still in use and the migration note for each.
- Links to deeper app-surface or product-contract docs when they exist.

## Required Map

Record the current structure in these categories when they exist:

- Deployables: web apps, APIs, workers, schedulers, CLIs, mobile apps, edge functions, and release/deploy units.
- Runtime entrypoints: route handlers, controllers, queue consumers, cron jobs, webhooks, command scripts, and background tasks.
- Domain modules: bounded contexts, owning teams, primary entities, state machines, and invariant owners.
- Shared contracts: schemas, DTOs, generated clients, event contracts, API clients, and shared UI primitives.
- Data surfaces: databases, migrations, caches, queues, object storage, search indexes, and external system records.
- External integrations: identity, billing, payments, email, analytics, observability, deployment, and provider APIs.
- Transitional surfaces: adapters, migration shims, compatibility paths, and planned removal dates.

## Topology Rules

- The topology must be specific enough for a fresh agent to find the right entrypoint before editing.
- Runtime surfaces that receive production traffic or developer commands must be listed even if they are temporary.
- Shared packages need a stated owner and allowed consumers; otherwise they are not architecture boundaries.
- Transitional surfaces need a migration note, current owner, and removal trigger.
- Do not describe aspirational components as current topology. Put future topology in a future plan until it lands.
- Keep provider names and sensitive infrastructure details as specific as needed for engineering, but do not expose secrets or private credentials.

## Verification

- Keep this file aligned with `ARCHITECTURE.md`, `docs/architecture/README.md`, and `docs/governance/architecture-rules.json`.
- Update it whenever runtime entrypoints, package boundaries, or transitional surfaces change.
- Run `npm run docs:verify` for documentation-only topology changes.
- Run `npm run architecture:verify` when topology changes affect imports, tags, package boundaries, or dependency rules.
