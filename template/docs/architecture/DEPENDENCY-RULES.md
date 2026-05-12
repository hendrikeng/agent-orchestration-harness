# Dependency Rules

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document and `docs/governance/architecture-rules.json`.

## Rules

- Enforce module boundaries with explicit dependency constraints, not informal reviewer memory.
- Keep dependency direction aligned with `docs/architecture/LAYERS.md`.
- Preserve server-authority boundaries for sensitive domain operations.
- Prefer explicit domain contracts over cross-domain imports.
- Shared code is allowed only when it is stable, ownership is clear, and it does not smuggle domain behavior across boundaries.
- UI/runtime adapters may depend inward on services and contracts; services must not depend on UI, route handlers, controllers, jobs, or framework-specific runtime objects.
- Repositories/data-access modules must not import UI, runtime adapters, service workflow code, or request/session objects.
- Types/contracts must remain side-effect free and must not import runtime, data access, environment, or framework code.
- Configuration modules may expose validated settings; business logic must not read raw environment variables directly when a config boundary exists.
- Generated code must have an owner and regeneration command. Do not hand-edit generated files unless the generator is unavailable and the exception is documented.
- Test-only shortcuts must stay in test utilities and must not become production imports.

## Boundary Exceptions

- A boundary exception must name the source, target, owner, reason, expiry, and removal plan.
- Exceptions must live in the relevant plan, evidence index, or architecture rule config; they must not live only in PR text or chat.
- Prefer a narrow allowlist over a broad rule relaxation.
- Expired exceptions block merge until removed, renewed, or converted into a deliberate architecture change.

## Rule Configuration

- Project tags, import graph checks, forbidden patterns, and command hooks live in `docs/governance/architecture-rules.json`.
- Human-readable policy belongs in this document; machine-readable gates belong in the JSON config.
- If the docs and config disagree, fix both in the same slice before claiming architecture verification as evidence.

## Verification

- Run `npm run architecture:verify`.
- Keep rule config synchronized with actual project tags and imports.
- `docs/governance/architecture-rules.json` may use project tags, relative import graph checks, forbidden import patterns, or command hooks.
- Template placeholder values must be replaced during adoption before architecture gates can provide full coverage.
- When architecture verification is skipped in template mode, downstream adoption must wire real project tags and import checks before treating the gate as production evidence.
- Any dependency-rule change must include either updated verification config or a written reason why the rule is currently review-only.
