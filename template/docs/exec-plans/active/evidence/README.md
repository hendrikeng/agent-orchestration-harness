# Active Evidence

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This directory.

## Purpose

- Canonical evidence artifacts for active execution plans.
- Keep only recent, decision-relevant evidence in this directory.
- Move older session detail into linked `*-session-archive.md` files when active evidence becomes noisy.
- Preserve enough current evidence for another engineer or agent to resume without relying on chat history.
- Keep raw command output only when it is needed for debugging; otherwise store concise command, result, and artifact references.

## Evidence Artifacts

- none

## Curation

- Dedup Mode: strict-upsert
- Files Currently Kept: 0
- Canonicalized: true

## Evidence Rules

- Evidence should name the plan ID, timestamp or run reference, command or check, result, and relevant artifact paths.
- Failed validation belongs here while the plan is active, along with the next action or blocker.
- Do not store secrets, raw credentials, private request bodies, or sensitive customer data.
- Move durable completion evidence to `docs/exec-plans/evidence-index/<plan-id>.md` when the plan closes.
- Delete or archive stale session notes that no longer influence decisions.
