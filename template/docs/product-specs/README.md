# Product Specs Index

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Canonical Specs

- `docs/product-specs/CURRENT-STATE.md`

## Product Spec Contract

- Product specs describe current behavior, accepted terminology, critical workflows, and durable user-facing constraints.
- They are not delivery logs, brainstorms, or implementation scratchpads.
- A spec is canonical only when it has metadata, an explicit owner, a dated state, and links to the behavior it governs.
- Plans may reference product specs for scope, but plans do not silently redefine product truth without updating the relevant spec.

## Adopted Repo Rule

- Add repo-specific product docs here as they become canonical or first-class supporting specs.
- Keep long-form market narrative, roadmaps, and domain specs listed here instead of relying on folder discovery alone.
- Prefer one durable spec per domain or workflow over scattered notes embedded in plans, PRs, or root README sections.

## Spec Metadata Standard

- Include owner, last-updated date, and source-of-truth in canonical specs.
- Keep current-state snapshots dated and aligned with the README's top-level scope without duplicating the README as a delivery log.
- Include meaningful product-state updates from completed execution plans in specs; keep slice-level delivery history in completed plans and evidence indexes.
- Mark uncertain claims explicitly instead of letting agents treat guesses as product requirements.
