# UI Standards

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Standards

- Reuse canonical UI primitives when they fit; promote new primitives only after real reuse or a stable cross-feature contract exists.
- Maintain explicit loading, error, empty, disabled, denied, success, retry, and permission states where those states can occur.
- Preserve accessibility baseline and interaction consistency.
- Keep operational workflows dense, scannable, and predictable rather than decorative or marketing-like.
- Match visual hierarchy to task importance; avoid hero-scale type, nested cards, or ornamental containers inside tools and dashboards.
- Use icons, controls, and component patterns that users already understand for common actions.
- Keep text, controls, and dynamic values inside stable responsive bounds on mobile and desktop.

## Interaction Standards

- Keyboard navigation, focus order, visible focus states, semantic labels, and screen-reader names are part of done.
- Primary actions must stay stable across loading, empty, error, and populated states.
- Destructive, privileged, or irreversible actions require clear affordance, confirmation or undo where appropriate, and server-side enforcement.
- Do not hide unavailable privileged actions as if they succeeded; use denied, disabled, or recovery states that match server authority.
- Avoid layout shifts caused by loading text, hover controls, validation messages, long labels, or translated strings.

## Visual System Rules

- Prefer existing spacing, typography, color, radius, and component conventions over one-off styling.
- Avoid one-note palettes and decorative backgrounds that reduce scanability or make the app feel less trustworthy.
- Do not put cards inside cards unless the design system explicitly defines that pattern.
- Use stable dimensions for grids, boards, toolbars, counters, tiles, and other fixed-format controls.
- Data-heavy views should optimize comparison, sorting, filtering, bulk action, and repeated scanning.

## UI Review Checklist

- Does the screen expose the actual workflow immediately rather than a marketing explanation?
- Are loading, empty, error, disabled, permission, optimistic, and success states covered?
- Does the layout work with long labels, empty values, small screens, and high-density data?
- Are forms, dialogs, tables, cards, and navigation consistent with the nearest live pattern?
- Is every user-visible status, badge, count, and label backed by canonical values or server facts?
- Did the change avoid duplicating route-specific logic inside shared presentation components?
