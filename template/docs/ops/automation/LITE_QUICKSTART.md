# Lite Quickstart

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Use this as the simplest explanation of how the manual harness should operate day to day.
`Lite` means low-overhead control, not weak process.

## Default Operating Loop

1. Plan a future in `docs/future/`.
2. Make it decision-complete.
3. Promote it manually into `docs/exec-plans/active/`.
4. Implement, validate, review, and keep evidence current.
5. Close the slice in `docs/exec-plans/completed/`.

## Planning Rules

- One future file equals one executable slice.
- `## Must-Land Checklist` is the exact execution contract.
- Checklist items must be Markdown task-list items with stable backticked IDs.
- Keep dependencies, implementation targets, risk tier, validation lanes, and security approval truthful.
- Planning-only requests stop in `docs/future/`.

## Execution Rules

- Use a direct active plan only when the task is genuinely small, low risk, and does not need staging in `docs/future/`.
- Work one active slice at a time.
- Keep validation evidence with the plan or PR while the slice is active.
- Do not let “manual” become an excuse for vague promotion or weak evidence.
- Keep scope changes visible in the active plan; split follow-up work when it stops fitting the current slice.
- Review medium and high risk changes before closeout.

## Required Commands

- `npm run context:compile`
- `npm run docs:verify`
- `npm run architecture:verify`
- `npm run agent:verify`
- `npm run eval:verify`
- `npm run plans:verify`
- `npm run project:gates:verify`
- `npm run verify:fast`
- `npm run verify:full`

## Non-Negotiables

- Promote only decision-complete futures.
- Keep the queue flat and manual.
- Preserve validation and evidence discipline.
- Keep agent-specific adapter files subordinate to canonical docs.
- Do not claim production readiness from placeholder gates or generic checks that do not cover the changed behavior.

## Reference Docs

- `docs/PLANS.md`
- `docs/future/README.md`
- `docs/exec-plans/README.md`
- `docs/ops/automation/README.md`
