# Planning Workflow

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document routes planning work to the detailed contracts under `docs/future/` and `docs/exec-plans/`.

## Purpose

Planning keeps intent, executable scope, validation, and evidence discoverable without turning one document into a second implementation manual.

Use one plan file per executable slice. Keep `## Already-True Baseline`, `## Must-Land Checklist`, and `## Deferred Follow-Ons` separate so completed scope is unambiguous.

## Choose A Path

- Use `docs/future/` for non-trivial work, cross-domain changes, architecture or invariant changes, staged rollout, multi-session work, and medium/high-risk changes.
- Use direct `docs/exec-plans/active/` entry only for isolated, low-risk work that can finish as one focused slice without changing architecture or critical invariants.
- If direct work expands, stop and create or promote a future slice.
- Planning-only requests stop in `docs/future/`; implementation requires explicit approval.

## Lifecycle

1. Read `VISION.md`, `AGENTS.md`, nearest live code, and relevant canonical docs.
2. Create one future slice and make its acceptance criteria, dependencies, targets, risk, validation, and must-land checklist explicit.
3. Set it to `ready-for-promotion` only when execution ambiguity and blockers are resolved.
4. Promote it into `docs/exec-plans/active/` and implement the smallest safe slice.
5. During implementation, run the smallest focused checks that prove the changed behavior. At the merge or delivery boundary, run `npm run verify:full` and relevant domain checks. If the changed contract requires these gates earlier, run them earlier. Report skipped checks explicitly.
6. Move the completed plan to `docs/exec-plans/completed/` and preserve concise evidence under `docs/exec-plans/evidence-index/`.

## Canonical Detail Owners

- `docs/future/README.md`: future metadata, intake, promotion, multi-phase coverage, and authoring rules.
- `docs/exec-plans/README.md`: active/completed metadata, statuses, delivery semantics, evidence, and closeout.
- `docs/exec-plans/active/README.md`: active execution and session retention.
- `docs/exec-plans/completed/README.md`: completion requirements.
- `docs/ops/automation/LITE_QUICKSTART.md`: shortest day-to-day workflow.

General planning rules belong here only when they determine which detailed contract applies. Update the detailed owner instead of repeating its full checklist in this file.
