# Security

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Security Model

- Default-deny server-side authorization for privileged actions.
- Explicit identity, permission, plan/entitlement, and scope boundaries are mandatory where the product has them.
- Least-privilege handling is the default for admin, automation, integration, and credentialed service surfaces.
- Security-sensitive behavior must be enforced at the server/data boundary even when the UI hides or disables an action.

## Identity And Scope

- Use shared auth/session modules as the source of truth.
- Do not trust client-only state for authentication, authorization, entitlement, ownership, role, tenant, or team decisions.
- Keep authorization checks next to the server-side mutation, route handler, job, or service method that performs the sensitive action.
- Keep sensitive actions auditable through explicit route, plan, PR, and evidence updates.
- Treat background jobs, scripts, webhooks, imports, and service accounts as actors with explicit scope, not as bypass paths.

## Data Safety Requirements

- Treat inbound integration, feed, webhook, upload, import, and user-generated content data as untrusted.
- Validate and sanitize external input before it influences stored state, rendered output, privileged decisions, or external side effects.
- Keep external service credentials out of repo-tracked files, canonical docs, test fixtures, generated artifacts, and evidence.
- Redact secrets, raw tokens, API keys, OTPs, private request bodies, credential headers, and sensitive free text from logs, analytics, docs, and evidence.
- Prefer fallback UI or explicit rejection over broadening allowlists for malformed or unsupported external data.
- Do not store sensitive derived data, raw payloads, or debug dumps longer than the product, audit, or recovery need requires.

## Integration And Automation Safety

- Webhooks and callbacks need signature/secret validation, replay defense, controlled parsing, and idempotent handling where the provider supports it.
- API clients should use scoped credentials and explicit outbound request shapes rather than broad ambient clients.
- Data exports, release scripts, migrations, and support tooling must avoid leaking secrets or cross-scope data into logs, files, artifacts, or evidence.
- Browser-visible configuration must be treated as public unless the adopted framework provides a verified private boundary.

## Security Review Checklist

- Identify the actor, resource, action, and trust boundary before changing an auth or mutation path.
- Validate request shape, controlled values, ownership, entitlement, rate limits, and replay/idempotency before external side effects.
- Use least-privilege service helpers; do not pass broad credentials or raw third-party clients into UI or unrelated route-local code.
- Make audit context explicit for admin, identity, payment, collaboration, bulk import, email, API-key, webhook, and privileged automation workflows where those exist.
- If a defect could cross tenant, team, account, payment, or privilege boundaries, add focused regression coverage or document why no stable harness exists.

## Security Testing Expectations

- Regression coverage is expected for authorization and permission-boundary defects.
- Validation should target isolation boundaries and privileged mutation flows when those areas change.
- Security-sensitive workflow changes must land with explicit validation evidence even when broader automated test coverage is still evolving.
