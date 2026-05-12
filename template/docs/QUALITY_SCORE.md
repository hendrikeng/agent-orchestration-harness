# Quality Score

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Scoring Legend

- 5: strong and continuously enforced
- 4: implemented with minor gaps
- 3: baseline exists but needs hardening
- 2: partial or inconsistent
- 1: missing or largely manual

## Domain Scores

- Domain correctness and invariants: {{SCORE_DOMAIN_CORRECTNESS}}
- Critical-domain safety and auditability: {{SCORE_CRITICAL_SAFETY}}
- Authorization and boundary enforcement: {{SCORE_AUTHZ_BOUNDARIES}}

## Platform Scores

- Architecture boundary enforcement: {{SCORE_ARCH_BOUNDARIES}}
- Documentation governance enforcement: {{SCORE_DOC_GOVERNANCE}}
- Test coverage for critical flows: {{SCORE_CRITICAL_TESTS}}

## Engineering Quality Bar

A slice is high quality only when it clears all applicable gates:

- `correctness`: behavior follows current schema, live code patterns, documented product state, and explicit user intent.
- `contract`: boundary types, validation, authorization, persistence, and UI mapping are aligned across every touched layer.
- `maintainability`: ownership is clear, files remain legible, abstractions reduce real complexity, and duplicate local helpers are not introduced.
- `reliability`: important failure modes are handled deliberately, with retry, idempotency, fallback, rollback, or operator recovery where the workflow needs it.
- `security`: sensitive data, privileged writes, API keys, external inputs, and external side effects remain server-authoritative and auditable.
- `experience`: user-facing flows preserve scanability, accessibility, loading/error/empty states, and trustworthy labels or metadata.
- `evidence`: validation output proves the changed behavior at the narrowest reliable surface, then the required gate proves repo-level consistency.

Scores below 4 mean agents should bias toward smaller slices, stronger evidence, and simpler implementation choices until the gap is closed.

## Score Update Rules

- Update scores only when evidence changes, not because a plan intends to improve them.
- Link score changes to completed plan evidence, CI output, architecture verification, eval reports, production observations, or explicit manual review notes.
- Keep score explanations short and actionable: name the gap, owner surface, and next validation step.
- Do not inflate scores when enforcement is still manual, intermittent, or limited to one route.

## Review Cadence

- Revisit quality scores after major architecture changes, critical incident fixes, release-gate changes, or new agent-hardening eval results.
- Scores should push work toward smaller, better-proven slices when the repo is below the expected bar.
- A high score means the behavior is enforced and observable enough for future agents to trust it.

## Current Gaps

- {{QUALITY_GAP_1}}
- {{QUALITY_GAP_2}}
