# Vision

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document is the concise product-direction entrypoint.

## Purpose

- {{PRODUCT_DIRECTION}}
- Give humans and agents enough durable product context to recognize strategically correct work without turning product vision into an execution manual.

## Users And Outcomes

- Primary users: {{PRIMARY_USERS}}
- Target outcomes: {{TARGET_OUTCOMES}}
- Product tradeoffs and non-goals must be explicit rather than emerging accidentally from implementation convenience.

## Desired State

- The product solves a clear user problem through coherent workflows and explicit domain language.
- Current product truth is grounded in live behavior, schemas, and canonical product specifications.
- Architecture, security, reliability, and authority boundaries support the intended product rather than becoming goals by themselves.
- Broader ambition is translated into bounded, evidence-backed slices before it becomes executable scope.

## Durable Product Principles

- Product intent must not be silently redefined by an implementation, framework, runtime, or agent.
- Critical domain invariants, trust boundaries, and irreversible decisions remain explicit and reviewable.
- User-visible success must reflect real system capability; mock, degraded, unavailable, or review-required states must not become fake production success.
- Automation and AI remain inside the authority boundaries appropriate to the product and its users.
- Product expansion follows demonstrated user value, operational readiness, and trustworthy data rather than speculative surface area.
- When product direction and current implementation disagree materially, update the correct source of truth or stop for a human decision.

## Strategic Boundaries

- Vision describes product direction; it does not authorize broad implementation or replace bounded delivery scope.
- Architecture, automation, and process exist to support product outcomes rather than becoming product goals themselves.
- Future and execution plans must not reinterpret long-term ambition as permission to bypass current product truth, authority boundaries, or evidence.

## Canonical Product References

- `docs/product-specs/CURRENT-STATE.md`: what is true today.
- `docs/product-specs/`: detailed product narratives and domain specifications.
- `AGENTS.md`: repository operating rules and engineering constraints.
- `docs/agent-hardening/AGENT_LOOP.md`: implementation, verification, evidence, and closeout workflow.
- `docs/future/` and `docs/exec-plans/`: bounded proposed, active, and completed delivery scope.

This document defines direction, not procedure. Keep it short enough to read before implementation and stable enough to remain useful across many slices.
