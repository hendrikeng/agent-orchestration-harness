# API Operations

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Define the operational quality bar for internal and external API surfaces.

## API Contract

- Every API boundary names its actor, auth method, authorization scope, rate-limit posture, request shape, response shape, and error model.
- Public APIs need versioning, compatibility notes, and deprecation behavior before consumers depend on them.
- Internal APIs still need validation, typed contracts, redaction, and observability; "internal" is not a reason to skip safety.
- Webhooks, uploads, imports, callbacks, and partner feeds are untrusted input until validated and normalized server-side.
- API handlers depend on shared services, auth, validation, and data-access layers, not UI components or route-local page state.

## Operational Expectations

- Sensitive API paths require audit context, structured error classes, and explicit evidence for permission-boundary changes.
- External side effects need idempotency, timeout, retry, replay, and duplicate-submission behavior appropriate to the risk.
- API observability must avoid secrets, tokens, private request bodies, raw credentials, and sensitive free text.
- Generated API docs or schemas are derived artifacts; canonical behavior remains in code, tests, and docs.

## Verification

- Add focused contract or regression coverage for changed API behavior when a stable harness exists.
- Manual evidence must name the endpoint, actor or credential class, payload shape, expected status, and relevant authorization or rate-limit condition.
- API changes that alter auth, rate limits, request/response shape, error semantics, retries, idempotency, or external side effects require `docs/RELIABILITY.md` and `docs/SECURITY.md` review where applicable.
- Public or partner-facing API changes require compatibility notes before release.

## Incident And Recovery Notes

- Record known degraded modes and operator recovery paths for critical API surfaces.
- Keep replay or repair commands targeted and auditable.
- Do not run production data repairs from API docs alone; link to the approved runbook, plan, or release evidence.
