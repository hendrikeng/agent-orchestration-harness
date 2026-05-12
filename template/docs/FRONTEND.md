# Frontend Standards

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Current Stack

- {{FRONTEND_STACK}}
- Shared UI primitives/components are canonical where reuse is real.
- Shared contracts/types are consumed from the project contract layer.

## Frontend Quality Bar

- Page or route entrypoints own params, search params, initial data loading, and stable prop shaping.
- Client entries own interaction state and view coordination; they must not become data-access, permission, or schema-normalization layers.
- Leaf components render one clear concern and receive narrow named props rather than whole query objects or route-level bags.
- Important workflows need explicit loading, empty, error, disabled, optimistic, retry, and success states where those states can occur.
- User-visible labels, badges, counters, and metadata come from canonical controlled values or server-returned facts, not duplicated string logic.
- Responsive behavior must be stable for tables, cards, forms, dialogs, and action bars before the slice is considered done.

## Project Structure

- Keep page-level coordination in route/page entrypoints and route-local action/controller files.
- Keep feature UI close to the route first; promote to shared UI only when reuse is already real or clearly cross-feature.
- Shared components should stay generic and must not absorb route-specific workflow, query, permission, or persistence assumptions.
- Keep shared component props narrow and focused; prefer derived display shapes over passing raw API/query payloads.
- Match the nearest live route or component pattern before introducing a new state model, layout model, or interaction pattern.

## Data Wiring

- Use typed contract boundaries between UI and API/server code.
- Do not rely on client-only state for sensitive authority, permissions, or completion.
- Await or resolve route params/search params at the route boundary when the framework exposes them asynchronously.
- Prefer server-returned canonical state after mutations; optimistic UI needs rollback or reconciliation.
- Scope effects to concrete dependencies and avoid effects whose only purpose is to synchronize two local sources of truth.
- Do not introduce a new client fetch path when an existing query, action, API helper, or shared hook owns the same contract.

## Feature Build Order

- For a new workflow, align contract/schema, route state, server/API boundary, then UI; do not wire list, detail, form, admin, and bulk behavior all at once.
- Stabilize display shape, permission states, loading/error/empty states, and validation copy before adding polish or extra entrypoints.
- Promote shared UI only after the route-local version proves a real reusable concept.

## UI Conventions

- Preserve information density without clutter.
- Prefer one clear workflow container over fragmented nested cards.
- Keep section framing broad and labels specific.
- Reuse shared form, table, card, dialog, and navigation patterns when they fit.
- Do not introduce decorative shells, oversized headings, or nested cards into operational workflows where scanning, comparison, and repeated action matter more.
- Keep action placement stable across loading, empty, error, permission-disabled, and populated states.
- Verify long labels, empty values, and permission-disabled actions before considering a UI workflow complete.

## Form And Dialog Rhythm

- Use a noticeably smaller label-to-control gap than the gap between field groups.
- In page forms, group fields with enough vertical rhythm for scanability.
- In dialogs and inline editors, keep spacing tighter and avoid redundant subsection headings.
- Prefer dividers, spacing, and clear labels over nested cards for internal grouping.

## Accessibility And Interaction

- Preserve keyboard navigation, focus order, visible focus states, semantic labels, and screen-reader names when changing interaction patterns.
- Do not hide unavailable privileged actions as if they succeeded; use disabled, denied, or recovery states that match server authority.
- Avoid layout shifts caused by loading text, hover controls, validation messages, or long translated labels.

## Frontend Validation Expectations

- Validate the smallest surface that proves the changed workflow: component test, route test, browser smoke, screenshot, or manual evidence as appropriate.
- Check realistic content: long names, empty values, denied actions, slow loading, validation errors, and failure responses.
- For interactive changes, verify keyboard path, focus recovery, disabled/loading state, and screen-reader names where the component model supports them.
- UI evidence should show the actual product state, not just a successful build command.

## Current Workspace Entry Points

- {{FRONTEND_ENTRYPOINT_1}}
- {{FRONTEND_ENTRYPOINT_2}}
