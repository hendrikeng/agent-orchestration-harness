# Vision

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

This file defines the desired state that humans and agents should reconcile toward. It is the loop root: stable enough for a fresh human or agent to understand the purpose, invariants, gates, and memory locations before reading implementation details.

## Purpose

- {{PRODUCT_DIRECTION}}
- Encode product intent, architecture boundaries, checks, and evidence so work can continue across sessions without relying on chat history.

## Users And Outcomes

- Primary users: {{PRIMARY_USERS}}
- Target outcomes: {{TARGET_OUTCOMES}}
- Non-goals and tradeoffs must be explicit in plans instead of implied by implementation convenience.

## Desired State

- Product behavior is grounded in live code, schema, canonical docs, or explicit user intent.
- Product specs describe the current accepted product truth.
- `AGENTS.md`, governance docs, and domain docs define the operating boundaries for implementation work.
- Plans describe one executable reconciliation slice with acceptance criteria and evidence.
- Checks can reject unfinished work through tests, type checks, builds, verifiers, screenshots, logs, or manual evidence appropriate to the risk.

## Loop Invariants

- Critical invariants in `AGENTS.md`, `docs/governance/RULES.md`, and domain docs must shape implementation before UI or automation polish.
- Agents must not silently redefine product truth. When implementation and canonical docs conflict, update the correct source of truth or stop for a human decision.
- The maker and checker roles should be separated for risky work through review, tests, focused verification, or a reviewer sub-agent when available.
- A loop without external rejection signals is not complete. Self-assessment alone is not evidence.
- Commit and push only when requested or when the workflow explicitly calls for it.

## Drift Signals

- Product specs, architecture docs, tests, and live behavior disagree.
- A plan changes user-visible behavior without updating the relevant canonical docs.
- A check is weak, skipped, stale, flaky, or unable to fail on the behavior it claims to cover.
- Repeated agent runs make broad edits without reducing uncertainty, failures, or open questions.
- Generated context, plans, or evidence no longer match the current repository state.

## Verification Gates

- Use the smallest check that can honestly reject the change, then broaden when the risk or blast radius requires it.
- Prefer deterministic gates: tests, type checks, builds, policy verifiers, schema checks, linting, and contract checks.
- For UI or workflow changes, include runtime evidence such as screenshots, browser verification, logs, or recorded manual checks.
- For documentation-only changes, verify links, ownership, source-of-truth claims, and alignment with nearby canonical docs.
- Record what ran, what failed, what was fixed, and what remains unverified.

## Memory Locations

- `VISION.md` defines desired state and loop invariants.
- `AGENTS.md` defines operating rules for agents.
- `docs/product-specs/` defines current product truth and accepted behavior.
- `docs/future/` and `docs/exec-plans/` hold planned, active, and completed reconciliation work.
- `docs/generated/` and plan evidence folders hold generated runtime context, reports, and proof artifacts.

## Operating Strategy

- Keep one executable slice per plan file.
- Prefer the smallest product-visible or operationally useful step that can be validated honestly.
- Use source-specific evidence, explicit contracts, and reversible rollout paths for high-risk changes.

## Default Agent Loop

1. Read `VISION.md` for desired state and `AGENTS.md` for operating rules.
2. Inspect nearest live code, schema, routes, services, scripts, tests, and canonical docs.
3. Translate the request into acceptance criteria and the smallest proof that would make the result trustworthy.
4. Plan non-trivial work in `docs/future/` or the active queue before implementation.
5. Implement one scoped slice.
6. Run checks that can say no: tests, type checks, builds, policy verifiers, screenshots, or manual evidence appropriate to the risk.
7. Fix failures and repeat until the evidence supports the claim.
8. Record evidence in the plan, generated context, PR, or completion notes.
9. Escalate instead of guessing when product intent, authority, security, or destructive changes are unclear.

## Escalation Rules

- Stop and ask when the desired behavior is ambiguous and a wrong assumption would affect user-visible behavior, data integrity, security, billing, permissions, or deployment.
- Stop when the loop repeats without new evidence or keeps changing the same surface without convergence.
- Stop when required tools, credentials, services, or approvals are missing.
- Stop when verification cannot distinguish a real fix from a cosmetic or self-reported success.
