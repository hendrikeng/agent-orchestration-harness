# Design

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document and `docs/design-docs/`.

## Design Intent

- Clarity-first UI for high-stakes workflows.
- Consistent patterns across shared components.
- Accessible defaults in interaction and content.
- Interfaces should feel purpose-built for the domain, not like a generic component gallery.

## Design Principles

- Keep flows explicit and reversible where possible.
- Surface state, errors, and constraints clearly.
- Reuse canonical UI primitives instead of forking.
- Preserve scanning, comparison, and repeated-use efficiency before adding decorative polish.
- Use hierarchy, spacing, and typography to reduce cognitive load; do not rely on color alone to communicate state.
- Match action prominence to consequence: destructive, privileged, irreversible, or expensive actions need clear separation and confirmation where appropriate.

## Workspace Pattern

- Domain screens should follow shared layout and state patterns.
- Data-heavy views must preserve readability and hierarchy.
- Operational screens should bias toward dense, stable layouts with predictable action placement.
- Marketing-style composition belongs only where the product surface is intentionally editorial or acquisition-focused.
- Do not nest cards inside cards or create decorative shells around normal work surfaces.

## Accessibility and UX Baseline

- Keyboard and focus behavior must be intentional.
- Color contrast must remain readable.
- Loading/error/empty states must be defined.
- Long labels, translated strings, missing data, and permission-disabled actions must not break layout.
- Forms, dialogs, tables, navigation, and command surfaces need semantic names and visible focus behavior.

## Design Review Gate

- Which workflow is the screen optimizing for?
- What are the primary, secondary, disabled, dangerous, and recovery actions?
- What does the user see while data loads, fails, is empty, is stale, or is denied?
- Does the layout remain legible on the smallest supported viewport and with realistic content?
- Is this pattern already defined in `docs/design-docs/UI-STANDARDS.md`, `docs/ui/`, or live shared components?
