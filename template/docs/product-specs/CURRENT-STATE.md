# Current State

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.
Current State Date: {{CURRENT_STATE_DATE}}

This file is the canonical product-state snapshot. It tells agents what the product already does, which behavior is trusted, and which assumptions still need proof from live code or product owners.

## Scope Snapshot

- {{SCOPE1}}
- {{SCOPE2}}
- {{SCOPE3}}
- Additional repo-specific depth and roadmap notes can live under this file.

## Current Product Surface

- `primary users`: document the users or operators this repository serves.
- `core workflows`: document the workflows that must stay coherent across product, UI, backend, and evidence.
- `critical entities`: document the domain objects whose state transitions must stay correct.
- `privileged actions`: document the actions that require explicit authority, auditability, or elevated review.
- `external systems`: document integrations, imports, exports, callbacks, or providers that influence product behavior.

## Behavior Contracts

- Document stable user-visible behavior here before agents expand or rewrite it.
- Keep workflow state names, status transitions, controlled labels, and product terminology aligned with live code.
- Call out behavior that is intentionally missing, manual, degraded, or behind an environment/config gate.
- If a plan changes the meaning of a user-visible state, update this file in the same slice as implementation and validation evidence.

## Current Risks And Open Questions

- Document the highest-risk unknowns that future agents must verify before expanding behavior.
- Remove resolved questions when completed evidence or updated specs make the answer durable.

## Agent Use

- Treat this document as product truth, not as delivery history.
- Verify stale or surprising claims against nearest live code before changing behavior.
- Do not infer roadmap priority from this snapshot; use `docs/future/`, active plans, and explicit user requests for executable scope.
