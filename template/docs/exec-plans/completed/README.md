# Completed Plans

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This directory.

Move completed plans here with closure notes and validation evidence.

Each completed plan must include:

- `## Metadata` with `Status: completed`.
- `## Must-Land Checklist` with every checkbox item checked.
- `## Validation Evidence` section.
- `## Closure` section with completion timestamp and run/commit evidence.
- `Done-Evidence` pointing at the canonical compact evidence index for the plan.

## Completion Rules

- A plan is complete only when the must-land checklist, validation evidence, docs updates, and closure notes agree.
- Completed plans are historical records. Do not rewrite them for new target state; create a new future or active plan instead.
- If a completed plan is found to be inaccurate, add a corrective note with date, owner, and linked follow-up rather than silently editing history.
- Keep completion evidence compact. Large logs, screenshots, traces, or reports should be referenced by path, not pasted wholesale.
- Release notes and evidence indexes may summarize completed plans, but this directory remains the per-plan closure record.
