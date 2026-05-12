# Environment Model

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Environment Contract

- Document environment ownership and variable scope.
- Keep secrets out of repository docs, code, fixtures, generated artifacts, logs, and evidence.
- Never edit `.env` files without explicit instruction.
- Environment behavior must be validated through typed/configured boundaries where the stack supports it.
- Production-affecting environment changes require an owner, rollout note, rollback or fix-forward path, and validation evidence.

## Required Inventory

Record environment variables by name only, not by secret value:

- variable name
- purpose
- required environments
- owner
- sensitivity class: public, internal, secret, regulated
- default or local-development behavior
- validation location or config module
- rotation or expiry expectation when applicable

## Scope Rules

- Public client-exposed variables must be explicitly marked and must not contain secrets or privileged identifiers.
- Server-only secrets must stay server-side and must not flow into UI bundles, generated docs, screenshots, or telemetry.
- Test fixtures should use fake values that cannot be confused with production credentials.
- Avoid scattered raw environment reads; centralize parsing and validation in the config layer.
- Do not make runtime behavior depend on undocumented environment variables.

## Change Rules

- Adding, renaming, or removing an environment variable requires docs, config validation, and deployment/release notes when the change affects deployed environments.
- Changing secret scope or provider credentials requires security review evidence when the project has a security owner.
- CI/CD variables belong in protected provider settings; workflows may reference names but must not expose values.
- Environment changes must be reflected in `docs/deploy/README.md` when they affect promotion, rollout, runtime ownership, or operational recovery.
