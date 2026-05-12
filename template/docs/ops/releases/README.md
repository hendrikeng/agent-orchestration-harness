# Release Operations

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Define the release quality bar without binding the blueprint to one hosting provider or tracker.

## Release Contract

- A release candidate is a reviewed, verifiable change set, not a place to discover basic correctness.
- Release notes summarize included slices, user impact, migrations/backfills, environment changes, validation, and rollback or fix-forward expectations.
- Release gates must run repository scripts instead of duplicating policy in hosting-provider configuration.
- Branch, tag, preview, and deployment conventions are project-specific, but they must be documented here before agents treat them as mandatory.
- Release-only fixes must be mirrored back to the normal integration branch or explicitly tracked as follow-up debt.
- Exceptional commit-to-plan mappings live in `docs/ops/releases/release-mapping.md`.

## Release Mapping File

`docs/ops/releases/release-mapping.md` is lowercase because it is an operational ledger, not a canonical framework policy document. The script `scripts/automation/release-support-lib.mjs` reads it during `release:notes` and `release:verify`.

Use it only when the release verifier cannot infer a valid mapping from commit messages, completed plans, or accepted small-fix metadata. Normal releases should not need manual entries.

## High-Risk Release Checks

- Database, migration, backfill, auth, payment, integration, environment, and security-sensitive releases need explicit owner review.
- Environment changes require documented variable names, target environments, rollout order, and verification evidence without exposing secret values.
- Rollback is required when practical; otherwise document the fix-forward path and the data/operator impact.
- Deployment verification must inspect the real target environment, not only local build success.

## Verification

- Run `npm run release:verify` when the adopted project enables release support.
- Run `npm run release:notes` to draft release notes from completed plans and accepted mappings.
- Run `npm run verify:full` before release promotion.
- Run `npm run verify:deploy` for deployment health checks when a deployed target URL is available.
- Keep release evidence in PRs, completed plans, release notes, or the evidence index so a future agent can audit what shipped.

## Mapping Rules

- Prefer completed plan metadata and evidence indexes over manual mapping.
- Manual `Plan-ID` mappings must point to completed plans included in the release range.
- Manual `standard-change` mappings are only for small, low-risk fixes or operational commits with explicit rationale.
- Do not use release mapping to hide missing closeout, missing validation, or unresolved release risk.
