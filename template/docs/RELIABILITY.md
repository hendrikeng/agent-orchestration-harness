# Reliability

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Reliability Goals

- Deterministic behavior for domain-critical workflows.
- Retry and idempotency safety for external integrations, callbacks, imports, jobs, and notifications.
- Graceful failure behavior with explicit validation, rollback, retry, or recovery paths where partial failure is possible.
- Durable execution for work that must outlive browser sessions, page refreshes, request lifetimes, or a single agent session.

## Critical Flows

- {{CRITICAL_FLOW_1}}
- {{CRITICAL_FLOW_2}}
- {{CRITICAL_FLOW_3}}

## Reliability Controls

- Define the source of truth before adding caches, optimistic UI, local mirrors, background jobs, or denormalized views.
- Keep transaction boundaries explicit for multi-step critical mutations.
- Make replay behavior explicit for webhooks, cron jobs, queues, imports, enrichment, email, payments, analytics ingestion, and other external effects where applicable.
- Prefer idempotency keys, stable external IDs, deterministic conflict handling, or explicit dedupe over best-effort cleanup after writes.
- Keep partial-failure semantics visible: either dependent writes succeed, or the user/operator can see what failed and how to recover.
- Preserve raw-enough input, normalized output, and transformation evidence for data-quality work so later operators can audit mistakes.
- Make cache invalidation, revalidation, projection refresh, and derived-state rebuild behavior part of mutation design.
- Keep timeouts, retries, backoff, circuit breakers, and fallback behavior proportional to product risk and external dependency reliability.

## Durability And Recovery

- Long-running work needs resumable state, operator-readable progress, and a defined terminal status.
- Imports, backfills, migrations, and data repair scripts need target selection, preview/dry-run where practical, logs, and rollback or fix-forward notes.
- User-facing recovery should explain what failed, what persisted, and what action can be retried.
- Evidence for reliability work should include at least one failure or recovery path when that path is the purpose of the change.

## Reliability Anti-Patterns

- A user-visible success message before the durable write or external side effect is actually accepted.
- A retry path that can double-charge, double-email, duplicate records, or overwrite newer data.
- A background/script path that changes production data without targeting, logging, or rollback/fix-forward notes.
- A broad catch-all fallback that makes broken data look correct.
- A hidden background failure that leaves the visible product state looking complete.

## Validation Baseline

- `npm run verify:fast`
- `npm run verify:full`
- focused validation for critical mutation, integration, and recovery paths
- reliability work should target the highest-risk flows first rather than chasing broad but shallow coverage
