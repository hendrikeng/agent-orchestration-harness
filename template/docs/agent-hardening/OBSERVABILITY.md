# Agent Observability

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Required Run Trace Fields

- Unique run identifier, task identifier, repository, branch, and commit or dirty-worktree state.
- User request summary, active plan ID when applicable, and declared acceptance criteria.
- Provider, model identifier, runtime version, prompt or policy version, and execution entrypoint.
- Goal/run-control metadata: goal identifier when available, delegated task IDs, handoff boundaries, subagent roles, and provider-native background-run or session references.
- Context selection metadata: canonical docs, plan files, current-state docs, code surfaces, tests, and evidence references loaded for the task.
- Tool invocation events with tool name, risk tier, decision reason, normalized parameters, result status, duration, and redaction marker.
- Approval events for gated actions, including requester, approver when available, approved scope, expiry, and denial reason when denied.
- File change metadata: created, modified, deleted, generated, and ignored paths.
- Verification metadata: commands, tests, screenshots, manual checks, pass/fail status, and artifact paths.
- Continuity quality metadata: pending-decision, artifact, validation, blocker, assumption, and evidence counts.
- Cost and performance metadata when available: tokens, tool count, retry count, wall time, and queue time.
- Final outcome classification, termination reason, residual risk, and follow-up references.
- Incident bundle references for failed, degraded, interrupted, or policy-blocked sessions.

## Error Classification

- Classify failures as retryable, non-retryable, or policy-blocked.
- Record boundary and authorization failures distinctly from generic runtime errors.
- Capture the first failing step and the user-visible impact.
- Separate model errors, tool errors, validation failures, policy denials, environment failures, user interruptions, and stale-context failures.
- Separate delegation failures, missing handoff outputs, and provider-native goal-loop failures from generic workflow errors.
- Mark partial success explicitly when code changed but validation, evidence, or closeout is incomplete.
- Attach the smallest reproduction path: command, fixture, input, file path, trace ID, or incident bundle.
- Promote repeated failure classes into eval fixtures or policy updates.

## Retention and Redaction

- Keep traces long enough to support incident review, regression analysis, release audit, and repeated-failure eval creation.
- Redact secrets, credentials, personal data, customer data, private keys, tokens, and sensitive payloads from persistent logs.
- Store hashes, path references, or typed summaries when raw payloads are not required for debugging.
- Preserve auditability for policy decisions without storing unnecessary sensitive content.
- Trace retention must have an owner and deletion path before external observability systems are adopted.
- Failed or degraded sessions must preserve incident bundles until the regression is fixed, accepted with expiry, or explicitly closed.
