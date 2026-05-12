# Architecture Map

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Canonical Architecture Docs

- `ARCHITECTURE.md`
- `docs/architecture/TOPOLOGY.md`
- `docs/architecture/LAYERS.md`
- `docs/architecture/DEPENDENCY-RULES.md`
- `docs/governance/architecture-rules.json`

## Architecture Contract

- `ARCHITECTURE.md` owns the high-level invariants and read order.
- `TOPOLOGY.md` owns the current structural map: deployables, packages, adapters, external systems, and transitional surfaces.
- `LAYERS.md` owns dependency direction and layer responsibilities.
- `DEPENDENCY-RULES.md` owns enforceable import, tag, and boundary rules.
- `docs/governance/architecture-rules.json` is the machine-readable gate config consumed by `npm run architecture:verify`.

Architecture docs must describe the current system, not a target design that has not landed. Planned architecture belongs in `docs/future/` or an active execution plan until implemented.

## Update Triggers

Update this architecture set when a change adds, removes, renames, or materially changes:

- deployable apps, API surfaces, jobs, workers, CLIs, scripts, or release/deploy entrypoints
- package/module boundaries, shared contracts, generated types, or cross-cutting libraries
- data stores, queues, caches, external providers, auth boundaries, or privileged write paths
- dependency direction, import rules, ownership tags, or project gate configuration
- transitional or compatibility surfaces that still receive traffic or developer use

## Review Rules

- Start from the nearest live code and tests, then update docs to match the implemented structure.
- Keep architecture decisions traceable to code, config, migrations, tests, plans, or explicit user intent.
- Do not hide unclear ownership behind broad terms like "shared" or "common"; name the owning layer and allowed consumers.
- Any exception to dependency direction needs an owner, reason, expiry, and follow-up plan.
- Architecture-only docs changes still require `npm run docs:verify`; boundary or config changes require `npm run architecture:verify`.
