# Memory and Context Policy

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Context Budget Rules

- Treat the repo as the main operating system for agent work.
- Keep plans, evidence, docs, code, review findings, and validation output as the source of truth.
- Treat `## Must-Land Checklist` as the execution contract and keep `## Already-True Baseline`, `## Must-Land Checklist`, and `## Deferred Follow-Ons` separate.
- Prioritize current task requirements, nearest live code, critical invariants, and recent authoritative state.
- Default to the smallest durable context that can safely resume the current slice.
- Trim low-value context before truncating policy, invariants, or active plan requirements.
- Keep prompts deterministic for critical workflows.
- Prefer concrete anchors over summaries when precision matters: file paths, command names, plan IDs, evidence paths, issue IDs, and exact blockers.

## Durable Context

The durable context packet for resuming work is:

- `AGENTS.md`
- `README.md`
- `docs/generated/AGENT-RUNTIME-CONTEXT.md`
- the current future or active plan when applicable
- nearest live implementation and tests
- relevant canonical docs
- compact evidence and validation references

Persist distilled findings and stable references, not raw session history.

## Persistence Rules

- Persist only data required for work recovery, audit, or user intent.
- Do not persist secrets, credentials, or transient sensitive payloads.
- Define expiration and deletion behavior for persisted memory when the project adds external memory systems.
- Do not use external memory as the authority for policy, architecture, product state, security, or release readiness.
- Convert durable decisions back into repo-local docs, plans, evidence indexes, tests, or generated runtime context.
- Store conflict state explicitly when facts disagree: source, timestamp, owner, and current tie-break decision.
- Keep reasoning state separate from evidence state:
  - reasoning: current subtask, next action, blockers, rationale
  - evidence: accepted facts, artifact references, extracted findings, validation references

## Improve Before Re-Architecture

- Better active-plan quality and stable must-land identifiers.
- Better current-state docs that distinguish shipped behavior from planned behavior.
- Better evidence compaction with exact reproduction commands and artifact references.
- Better generated runtime context that points to canonical docs instead of copying policy.
- Better validation and observability for repeated agent failure modes.
- Better tests for resume, interruption, stale-context, and policy-boundary regressions.

## Do Not Add Yet

- Do not add broad agent memory databases to compensate for weak plans, stale docs, or missing validation.
- Do not persist raw chat transcripts, chain-of-thought, secrets, credentials, personal data, or unredacted production payloads.
- Do not create agent-specific policy forks when canonical docs are incomplete; fix the canonical owner instead.
- Do not let provider session history become required infrastructure for completing repository work.
- Do not accept unversioned memory entries for release, security, or architecture decisions.

## Consider Bigger Changes Later

- Add a versioned memory store only after repo-local plans, docs, validation, and generated runtime context are consistently reliable.
- Require schemas for memory entries before storing them outside the repo: type, owner, provenance, expiry, sensitivity, and invalidation rule.
- Add retrieval evaluation before using memory in critical workflows; retrieval must prove precision, recall, freshness, and redaction behavior.
- Add automatic memory invalidation when canonical docs, schemas, APIs, security boundaries, or critical workflows change.
- Add incident replay support only after traces and evidence indexes are stable enough to compare expected and observed behavior.

## Safe Rule

Keep durable agent state repo-local by default. If future memory infrastructure exists, it may accelerate retrieval, but the repository must remain sufficient to resume, review, verify, and hand off the work.

## Provenance and Redaction

- Record provenance for retrieved memory/context used in decisions.
- Prefer canonical local docs over ad-hoc memory for policy decisions.
- Redact sensitive fields in stored memory and retrieval logs.
- Retain exact anchors when they matter for resumption: file paths, plan IDs, evidence index paths, validation references, and concrete blockers.
- Log enough retrieval metadata to audit why context was used without storing sensitive payloads unnecessarily.
- When redaction changes meaning, store the redacted form plus a reference to the protected source and access path, not the protected content.
