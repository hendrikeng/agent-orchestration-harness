# Ops Runbooks

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Define operational entrypoints for API behavior, engineering workflow, release operations, and recovery expectations.

## Canonical Ops Docs

- API operations: `docs/ops/api/README.md`
- Engineering workflow: `docs/ops/automation/README.md`
- Lite lane onboarding: `docs/ops/automation/LITE_QUICKSTART.md`
- Engineering outcomes scorecard: `docs/ops/automation/OUTCOMES.md`
- GitHub interop mapping: `docs/ops/automation/INTEROP_GITHUB.md`
- Release operations: `docs/ops/releases/README.md`

## Operational Contract

- Link incident runbooks, dashboards, release notes, and escalation paths from this ops tree when the adopted project has them.
- Keep runbooks current with architecture, deployment, environment, security, and reliability changes.
- Keep runtime-specific instructions subordinate to canonical repo scripts and docs.
- Do not store secrets, credentials, private hostnames, or private runbook contents in public template docs.
- Operational claims require evidence: command output, health check, trace, screenshot, PR check, incident record, or release evidence.

## Update Triggers

Update ops docs when a change affects:

- API behavior, auth scope, rate limits, retries, or public compatibility
- engineering workflow, plan lifecycle, PR checks, or evidence requirements
- release branch/tag conventions, release verification, or deployment verification
- operational dashboards, incident escalation, recovery paths, or owner transitions
- CI/CD workflows, CODEOWNERS, or provider integration behavior
