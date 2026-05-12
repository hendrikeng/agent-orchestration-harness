# Engineering Outcomes

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Keep engineering quality measurable with a compact, repeatable scorecard.

## Data Sources

- completed plans
- evidence indexes
- validation summaries
- PR or change-review summaries when the project uses them
- incident, bug, or regression records when available

## Scorecard Metrics

- Plan quality:
  - Future slice was decision-complete before promotion.
  - Must-land checklist mapped to concrete artifacts and validation.
- Review quality:
  - Review found bugs, risks, missing tests, or evidence gaps before merge.
  - High-risk changes received explicit security/reliability scrutiny.
- Validation quality:
  - Narrow behavior proof exists for the risky change.
  - Required fast/full gates passed or gaps were explicitly accepted.
- Regression rate:
  - Repeated defects in the same area trigger stronger docs, tests, or checks.
- Lead time:
  - Slice size remains small enough for review without losing correctness.
- Evidence quality:
  - Completed plans link to compact evidence indexes.
  - Evidence proves changed behavior rather than only listing commands.
- Gate maturity:
  - Required lint, typecheck, test, and build gates are real project commands.
  - Deferred or not-applicable gates have concrete rationale and owners.

## Interpretation Guide

- Good signal:
  - Plans are small and executable.
  - Reviews catch concrete issues.
  - Evidence proves behavior, not only command execution.
  - Similar defects become tests or checks.
- Investigation signal:
  - Broad plans repeatedly stall.
  - Validation is mostly generic and does not cover changed behavior.
  - Docs are updated after the fact instead of with the behavior.
  - Repeated review comments point to missing canonical rules.

## Notes

- This scorecard is intentionally lightweight.
- It is an engineering quality summary, not a replacement for product metrics.
- Use the scorecard to improve rules, tests, docs, and gates; do not use it to reward larger process or broader plans.
