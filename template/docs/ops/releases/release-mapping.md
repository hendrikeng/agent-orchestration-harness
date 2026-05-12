# Release Mapping

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This file plus `scripts/automation/release-support-lib.mjs`.

This lowercase file is an operational ledger consumed by `scripts/automation/release-support-lib.mjs`, not a canonical policy doc. It is only for exceptional release-range commits that cannot be mapped from commit metadata, completed plans, or accepted small-fix rationale.

## Rules

- Prefer completed plan metadata and PR templates over manual mapping.
- Use manual mapping only when a release candidate includes a commit that is otherwise valid but lacks machine-readable `Plan-ID` or accepted small-change metadata.
- Planned slice mappings must point to completed plans included in the release range.
- Standard-change mappings must stay limited to small, low-risk fixes or operational commits with explicit rationale.
- Do not use this file to hide missing closeout, missing validation, or unresolved release risk.

## Mapping Format

```md
- Commit: `abcdef123456` | Plan-ID: `example-plan-id` | Rationale: Squash commit omitted plan metadata but delivered this completed plan.
- Commit: `abcdef123456` | Type: `standard-change` | Rationale: Small accepted fix that did not require completed plan evidence.
```

## Current Release Mappings

- None.
