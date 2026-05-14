# {{PRODUCT}}

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document delegates to linked canonical docs.
Current State Date: {{CURRENT_STATE_DATE}}

{{SUMMARY}}

## Product Scope

- {{SCOPE1}}
- {{SCOPE2}}
- {{SCOPE3}}

Detailed current behavior, terminology, risks, and product-state notes live in `docs/product-specs/CURRENT-STATE.md`.

## Operating Model

- Repository-local docs, code, checks, plans, and evidence are the durable source of truth.
- `AGENTS.md` is the concise operating map for humans and agents.
- Non-trivial work follows one flat queue: `docs/future/ -> docs/exec-plans/active/ -> docs/exec-plans/completed/`.
- Planning-only work creates or updates future slices and stops before implementation.
- Small, isolated, low-risk fixes may proceed directly when the PR carries enough review evidence.
- Goal, subagent, handoff, hook, guardrail, trace, and background-run features may be used through runtime-native tools; the blueprint does not require a separate orchestration layer.
- Every meaningful change should leave the repository easier for the next engineer or agent to understand.

## Architecture At A Glance

- Frontend/runtime stack: {{FRONTEND_STACK}}
- Backend/runtime stack: {{BACKEND_STACK}}
- Data/storage stack: {{DATA_STACK}}
- Shared contracts/primitives strategy: {{SHARED_CONTRACT_STRATEGY}}
- Architecture entrypoint: `ARCHITECTURE.md`
- Frontend standards: `docs/FRONTEND.md`
- Backend standards: `docs/BACKEND.md`
- Security model: `docs/SECURITY.md`
- Reliability model: `docs/RELIABILITY.md`

## Documentation Navigation

Start with:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/MANIFEST.md`
- `docs/README.md`
- `docs/PLANS.md`
- `docs/QUALITY_SCORE.md`
- `docs/FRONTEND.md`
- `docs/BACKEND.md`
- `docs/SECURITY.md`
- `docs/RELIABILITY.md`
- `docs/agent-hardening/README.md`
- `docs/agent-hardening/RUN_CONTROL.md`
- `docs/governance/README.md`
- `docs/governance/RULES.md`
- `docs/governance/project-gates.json`
- `docs/product-specs/README.md`
- `docs/product-specs/CURRENT-STATE.md`
- `docs/exec-plans/README.md`
- `docs/ops/automation/README.md`

Use `docs/MANIFEST.md` for the complete first-class documentation inventory.

## Enforcement and Quality Gates

- Bootstrap verification after initial placeholder replacement: `./scripts/bootstrap-verify.sh`
- Bootstrap helper cleanup: `npm run bootstrap:cleanup`
- Placeholder check: `./scripts/check-template-placeholders.sh`
- Runtime context build: `npm run context:compile`
- Docs governance: `npm run docs:verify`
- Architecture rules: `npm run architecture:verify`
- Agent policy checks: `npm run agent:verify`
- Eval report checks: `npm run eval:verify`
- Project gate declaration: `npm run project:gates:verify`
- Plan metadata verification: `npm run plans:verify`
- Fast iteration profile: `npm run verify:fast`
- Full merge profile: `npm run verify:full`
- Harness alignment: `npm run harness:verify`

Adopted projects must wire stack-specific lint, typecheck, test, build, database, browser, deployment, and security checks through `docs/governance/project-gates.json`. A missing gate must be marked `deferred` or `not-applicable` with a concrete rationale; silent missing testing is not allowed.

## Change Discipline

Changes affecting architecture boundaries, critical invariants, security, reliability, workflow, or user-visible behavior must update docs in the same change.

Update this README only when the change affects top-level product scope, stack, workflow, architecture, commands, or the major capability map. Put detailed behavior in `docs/product-specs/CURRENT-STATE.md`; put delivery evidence in completed plans and evidence indexes.
