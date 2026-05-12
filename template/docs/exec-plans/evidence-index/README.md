# Evidence Index

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This directory.

## Usage

- Each completed plan should point `Done-Evidence` to `docs/exec-plans/evidence-index/<plan-id>.md`.
- Each index file is the compact source for retained evidence links.
- Evidence indexes are review and release aids, not replacement plan files.
- Indexes should let a future agent answer: what changed, how it was validated, what risks remain, and where the proof lives.

## Indexed Plans

- none

## Policy

- Evidence is curated to keep useful, non-redundant information.
- Repeated unchanged blocker reruns are collapsed by strict-upsert policy.
- Keep evidence repository-local when possible.
- Redact secrets and sensitive payloads before storing evidence.
- Prefer exact commands, commit hashes, artifact paths, PR links, screenshots, trace IDs, and test names over narrative-only claims.
- Every accepted validation gap needs an owner, reason, expiry, and follow-up reference.
- Evidence indexes should be updated before release notes or release verification consume the completed plan.
