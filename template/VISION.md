# Product Vision

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

Use this document for durable product direction. It should be stable enough for a fresh human or agent to understand what the project is trying to become before reading implementation details.

## Product Direction

- {{PRODUCT_DIRECTION}}
- The repo should encode product intent, architecture boundaries, checks, and evidence so work can continue across sessions without relying on chat history.

## Users And Outcomes

- Primary users: {{PRIMARY_USERS}}
- Target outcomes: {{TARGET_OUTCOMES}}
- Non-goals and tradeoffs should be explicit in plans instead of implied by implementation convenience.

## Non-Negotiables

- Product behavior must be grounded in live code, schema, canonical docs, or explicit user intent.
- Critical invariants in `AGENTS.md`, `docs/governance/RULES.md`, and domain docs must shape implementation before UI or automation polish.
- Checks must be able to reject unfinished work. A loop without tests, type checks, verifiers, real errors, or review evidence is not complete.

## Current Strategy

- Keep one executable slice per plan file.
- Prefer the smallest product-visible or operationally useful step that can be validated honestly.
- Use source-specific evidence, explicit contracts, and reversible rollout paths for high-risk changes.

## Decision Rules

- Read `VISION.md`, `AGENTS.md`, nearest live code, and relevant docs before inventing new behavior.
- When strategy and local implementation conflict, update the appropriate canonical doc or stop and ask for a decision.
- When a change affects team workflow, architecture boundaries, security, reliability, or user-visible behavior, update docs in the same slice.

## Agent Loop Contract

Default loop:

1. Read `VISION.md` for direction and `AGENTS.md` for operating rules.
2. Inspect nearest live code, schema, routes, services, scripts, tests, and canonical docs.
3. Translate the request into acceptance criteria and the smallest proof that would make the result trustworthy.
4. Plan non-trivial work in `docs/future/` or the active queue before implementation.
5. Implement one scoped slice.
6. Run checks that can say no: tests, type checks, builds, policy verifiers, screenshots, or manual evidence appropriate to the risk.
7. Fix failures and repeat until the evidence supports the claim.
8. Record evidence in the plan, generated context, PR, or completion notes.
9. Commit and push only when requested or when the workflow explicitly calls for it.
