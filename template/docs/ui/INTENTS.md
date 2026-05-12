# UI Intents

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

UI intents are stable names for user-visible actions and interaction outcomes. They help agents preserve behavior while implementation details, components, or routes change.

## Intent Registry

| Intent | Meaning | Typical Surfaces | Required States |
| --- | --- | --- | --- |
| `create` | Start a new durable object or workflow. | Primary buttons, empty states, command menus. | enabled, disabled, loading, validation error, success/failure. |
| `edit` | Change an existing object. | Detail pages, tables, inline forms, dialogs. | enabled, disabled, dirty, saving, saved, failed. |
| `delete` | Remove or deactivate data. | Destructive buttons, menus, confirmation dialogs. | confirmation, loading, blocked, success/failure. |
| `submit` | Send a form or decision for processing. | Forms, approval flows, import/review steps. | valid, invalid, submitting, accepted, rejected. |
| `retry` | Reattempt a failed recoverable action. | Error states, import rows, background work status. | available, running, failed, exhausted. |
| `filter` | Narrow visible data without changing durable state. | Tables, lists, dashboards. | active, empty result, reset. |
| `navigate` | Move between product locations. | Navigation, breadcrumbs, tabs, row links. | current, available, unavailable. |
| `inspect` | Open read-only detail or evidence. | Tables, cards, audit logs, side panels. | available, empty, denied. |
| `export` | Produce a file or external representation. | Reports, tables, release/ops views. | preparing, ready, failed. |
| `configure` | Change settings that affect later behavior. | Admin, preferences, integration setup. | dirty, validating, saved, failed, permission-denied. |

## Mapping Rules

- Maintain canonical UI intent names and mappings here before introducing new shared action vocabulary.
- Keep intent mapping synchronized with shared UI implementation, analytics/events, tests, and docs that depend on it.
- Do not create synonyms for the same user outcome unless product language requires different labels in different domains.
- Keep destructive, privileged, or irreversible intents visually and semantically distinct from neutral actions.
- If an intent triggers a server mutation, the UI state must reflect server authority rather than assuming client-side success.

## Review Questions

- What user outcome does this control express?
- Which states can the user actually encounter?
- Is the label domain-specific while the intent remains reusable?
- Does the intent preserve keyboard, focus, disabled, loading, and error semantics?
