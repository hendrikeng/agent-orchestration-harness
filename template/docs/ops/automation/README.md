# Engineering Workflow

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

This directory defines how planned engineering work moves from intent to implementation-quality evidence.

Treat `docs/ops/automation/LITE_QUICKSTART.md` as the simplest day-to-day workflow reference.

## Goals

- Keep upcoming, active, and completed work easy to inspect.
- Continue current active work before starting more.
- Make implementation scope explicit before code changes.
- Keep docs, tests, validation, and evidence aligned with the change.
- Make review focus on code quality, correctness, security, reliability, and user impact.
- Preserve enough repo-local context for a fresh agent or engineer to resume safely.

## Queue Model

- `docs/future/`: proposed upcoming work not yet executing.
- `docs/exec-plans/active/`: current execution state and in-progress work.
- `docs/exec-plans/completed/`: completed execution plans and closure records.
- `docs/exec-plans/evidence-index/`: durable evidence summaries by plan ID.
- One file equals one executable slice.
- Larger initiatives are represented as multiple future files linked by `Dependencies`.

## Source Of Truth

- `AGENTS.md`: repo-level non-negotiables.
- `docs/PLANS.md`: lifecycle and promotion discipline.
- Current future or active plan file: slice scope and must-land contract.
- PR or change summary plus evidence index: review and closure record.
- `docs/product-specs/CURRENT-STATE.md`: current product behavior snapshot.

## Operating Loop

1. Make the future slice decision-complete.
2. Promote one slice into `docs/exec-plans/active/`.
3. Implement the smallest safe change.
4. Keep docs, validation notes, and evidence current.
5. Run required checks.
6. Review the change against the quality bar.
7. Close the plan into `docs/exec-plans/completed/` and update the evidence index.

## Execution Rules

- Work one active slice at a time unless the user explicitly coordinates parallel work with disjoint file ownership.
- Keep `Implementation-Targets`, `Risk-Tier`, `Validation-Lanes`, and `Security-Approval` truthful as scope changes.
- Medium and high risk changes need review scrutiny before completion.
- If the active slice becomes too broad, split follow-up work into `docs/future/` instead of expanding the plan indefinitely.
- Do not treat chat history, terminal scrollback, or provider session state as durable workflow state.

## Quality Review

Review should look for:

- correctness bugs and behavioral regressions
- data contract mismatches across layers
- missing authorization, validation, or trust-boundary checks
- unreliable retry, idempotency, recovery, or partial-failure behavior
- inaccessible or unstable UI states
- unnecessary abstractions, duplicate helpers, dead code, and unclear ownership
- missing tests, screenshots, validation output, docs, or evidence

## Verification Profiles

- `npm run context:compile`
- `npm run docs:verify`
- `npm run architecture:verify`
- `npm run agent:verify`
- `npm run eval:verify`
- `npm run plans:verify`
- `npm run harness:verify`
- `npm run project:gates:verify`
- `npm run verify:fast`
- `npm run verify:full`

Adopted projects should wire stack-specific lint, typecheck, build, database, browser, deployment, and test commands into these profiles when those surfaces exist.

## Related Documents

- `docs/ops/automation/LITE_QUICKSTART.md`
- `docs/ops/automation/OUTCOMES.md`
- `docs/ops/automation/INTEROP_GITHUB.md`
- `docs/PLANS.md`
- `docs/future/README.md`
- `docs/exec-plans/README.md`
- `docs/QUALITY_SCORE.md`
