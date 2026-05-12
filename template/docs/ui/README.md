# UI README

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Scope

- `docs/ui/` captures canonical user-visible interaction contracts.
- Keep this folder for UI behavior that is more specific than product specs and more stable than implementation notes.
- Do not duplicate visual system rules from `docs/design-docs/UI-STANDARDS.md` or runtime implementation details from `docs/FRONTEND.md`.
- Use this folder when user-visible behavior must survive component refactors, route moves, or provider-specific agent edits.

## Current Inventory

- `docs/ui/INTENTS.md`: canonical interaction-intent and UI event vocabulary.

## UI Contract Rules

- Record durable interaction semantics here, not one-off visual preferences.
- Keep product terms, action intent, state names, and empty/error/retry behavior aligned with `docs/product-specs/CURRENT-STATE.md`.
- Define states in terms users can experience: not-started, loading, empty, disabled, dirty, invalid, saving, success, failed, denied, retryable, and complete.
- Treat permissions, destructive actions, data export, import, payment, identity, admin, and integration setup flows as explicit UI contracts when present.
- When a UI contract changes, update tests or evidence that prove the behavior users will notice.

## When To Add More Here

- Add route or flow contracts when user-visible behavior spans multiple screens.
- Add state contracts when loading, empty, validation, retry, or error semantics must stay stable.
- Add user-visible copy or prompt contracts only when they are part of the product behavior contract.
- If a repo only needs `intents.md` today, that is valid; the folder still remains the canonical UI contract surface.
