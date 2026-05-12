# Product Sense

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Product Objective

- Deliver reliable operator workflows with explicit domain correctness.
- Favor clear user outcomes over speculative feature breadth.
- Build trust and legibility before expanding surface area.
- Preserve the smallest coherent product surface that solves the current workflow well.

## Decision Heuristics

- Prefer changes that improve correctness, observability, and operator confidence.
- Avoid new complexity without measurable product value.
- Keep domain terminology and UX behavior consistent.
- Prefer product surfaces that match how users think about the domain, not incidental database shape.
- Choose boring, durable workflow improvements over broad feature scaffolding without acceptance evidence.
- If two options are similar, prefer the one that reduces future agent ambiguity and makes failure modes easier to see.

## Domain Outcomes

- Faster and safer completion of core workflows.
- Reduced ambiguity in state transitions.
- Lower operational risk in sensitive paths.
- Higher confidence that user-visible state reflects canonical server/product truth.

## Prioritization Rules

- Correctness and safety before convenience.
- Resolve production-impacting issues before incremental polish.
- Keep documentation and behavior aligned in the same change.
- Improve the highest-frequency or highest-risk path before adding parallel entrypoints.
- Do not add settings, modes, roles, or states unless the current product need is explicit.

## Product Review Questions

- Who benefits from this change and what task becomes faster, safer, or more reliable?
- Which current behavior in `docs/product-specs/CURRENT-STATE.md` changes?
- What new state, label, error, permission, or exception will users encounter?
- What must be measured, tested, or evidenced before the change is considered done?
