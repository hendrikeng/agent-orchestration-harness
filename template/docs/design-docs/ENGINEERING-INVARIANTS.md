# Engineering Invariants

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Core Invariants

- Server-side authority for sensitive state.
- Authorization/isolation boundary enforcement.
- Deterministic numeric and timestamp handling for critical domains.
- Shared contracts define inter-module boundaries.
- Prefer root-cause fixes over superficial patches.
- Keep files concise and refactor when size hurts legibility or testability.
- Inbound external data is untrusted until validated at the boundary.
- User-visible state must come from canonical persisted or server-returned facts when correctness matters.
- Background, job, webhook, import, and script paths need idempotency or explicit replay semantics when they can repeat.
- Failures that affect user action, data integrity, payment, identity, or operator recovery must be visible and actionable.
- Generated artifacts need a source, regeneration command, and review expectation.
- A completed slice must leave enough evidence for another engineer or agent to reproduce the result.

## Implementation Discipline

- Start from the nearest live implementation and tests before adding a new pattern.
- Keep changes scoped to the requested behavior, active plan, or validation requirement.
- Prefer small explicit functions and stable contracts over broad wrappers that hide ownership.
- Do not duplicate schema, enum, permission, status, currency, timestamp, or controlled-label logic across layers.
- Remove introduced dead code, unused props/imports, duplicate helpers, and temporary scaffolding before closeout.
- When a change crosses layers, name the contract at each boundary and validate the riskiest boundary first.

## Quality Escalation

- When the same defect, review comment, or operator confusion repeats, strengthen the guardrail instead of restating the advice.
- Promote repeated guidance in this order when feasible: docs -> focused test coverage -> lint/structure rule -> script or automation gate.
- Bug fixes need regression coverage unless the failure mode cannot be reproduced mechanically.
- End-to-end coverage should stay focused on high-signal user journeys and regression-prone integration seams, not styling or implementation trivia.
- Prefer explicit test setup close to each test over hidden shared state unless shared setup materially improves correctness or cost.
- High-risk changes need focused tests or explicit evidence even when broader automation is still maturing.
- If a test would be brittle, prefer a lower-level deterministic check plus one manual evidence note over no coverage.

## Documentation Discipline

- Canonical docs must reflect real behavior.
- Behavior changes must update docs in the same change.
- Avoid parallel policy sources.
- Current-state docs describe shipped behavior. Future plans describe intended behavior. Completed plans and evidence indexes describe delivery history.
- Do not move policy into generated artifacts, PR descriptions, or runtime-specific notes; link back to the canonical owner.
- Documentation-only changes still need validation through the relevant doc verifier.
