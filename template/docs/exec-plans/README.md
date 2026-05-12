# Execution Plans

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Directory Layout

- `docs/exec-plans/active/`
- `docs/exec-plans/active/evidence/`
- `docs/exec-plans/completed/`
- `docs/exec-plans/evidence-index/`
- `docs/exec-plans/TECH-DEBT-TRACKER.md`

## Required Metadata

Every plan in `active/` and `completed/` must include `## Metadata` with:

- `Plan-ID`
- `Status`
- `Priority`
- `Owner`
- `Acceptance-Criteria`
- `Delivery-Class`
- `Dependencies`
- `Spec-Targets`
- `Implementation-Targets`
- `Risk-Tier`
- `Validation-Lanes`
- `Security-Approval`
- `Done-Evidence`

Optional fields:

- `Tags` (comma-separated routing hints such as `payments`, `security`, `migration`)

Every active or completed plan must also include:

- `## Already-True Baseline`: facts that are already true before the plan starts.
- `## Must-Land Checklist`: markdown checkboxes for the exact deliverables this plan must land before validation/completion.
- `## Deferred Follow-Ons`: broader target state or later-phase items that are intentionally not part of this plan's completion gate.
- Completed plans should include `## Validation Evidence` and `## Closure`.
- Product plans should prefix must-land items with stable backticked IDs such as `` `ml-example-capability` `` so evidence stays anchored to explicit claims.

## Delivery Semantics

- `Delivery-Class: product` means the plan must land shipped product behavior before validation/completion and must keep `Implementation-Targets` current.
- `Delivery-Class: docs`, `ops`, and `reconciliation` allow artifact-first completion when the acceptance criteria are truthful.
- `Implementation-Targets` are the authoritative code or artifact roots for shipped work. `Spec-Targets` capture broader impact and documentation references.
- `Validation-Lanes` are explicit queue routing inputs, not hints. Use `always` for repo-safe checks and add `host-required` when the plan needs environment-bound verification.
- `Security-Approval` stays `not-required` for most plans, including high-risk work that does not need a separate approval gate. Use `pending` only when an explicit security approval is required, and switch it to `approved` before execution resumes.

## Status Conventions

- Future plan statuses live in `docs/future/`: `draft`, `ready-for-promotion`.
- Active plan statuses: `queued`, `in-progress`, `in-review`, `budget-exhausted`, `blocked`, `validation`.
- Completed plan status: `completed`.

## Workflow

1. Use `docs/future/` for non-trivial planned work and `active/` only for currently executing slices.
2. Promote ready future slices into `active/`, or create an active plan directly for a tiny low-risk manual fix.
3. Validate plan metadata with `npm run plans:verify`.
4. Execute one active slice at a time.
5. Review medium and high risk changes before treating them as complete.
6. Run `npm run verify:fast` during implementation and `npm run verify:full` before completion.
7. Move completed plans to `completed/`, update `Done-Evidence`, and curate a compact evidence index under `docs/exec-plans/evidence-index/`.
8. Keep current, high-signal active evidence under `docs/exec-plans/active/evidence/` and keep tech-debt references current.

Do not use weak acceptance wording such as `at minimum`. If a change is too large for one plan, split it into multiple future slices linked by `Dependencies`.

## Evidence Contract

- Active evidence captures current decision state, failed checks, blockers, and latest validation.
- Completed evidence indexes capture durable proof after closure.
- Evidence must be specific: command, result, artifact path, commit or run reference, and residual risk where applicable.
- Do not store secrets, raw credentials, private payloads, or sensitive user data in plan evidence.
- If validation cannot be automated yet, record the manual check, reviewer, observed result, and follow-up automation path.

## Scope Discipline

- `## Already-True Baseline` is not a wish list; it contains facts verified before the slice starts.
- `## Must-Land Checklist` is the completion contract and should contain only work required for this slice.
- `## Deferred Follow-Ons` keeps broader target state visible without turning it into hidden acceptance criteria.
- A must-land item is too broad if it cannot be mapped to a concrete artifact and validation result.
- A plan is too broad if multiple owners, unrelated surfaces, or independent release risks are required to make progress.
