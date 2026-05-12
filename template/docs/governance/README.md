# Governance README

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Canonical Governance Docs

- `docs/governance/RULES.md`
- `docs/governance/GOLDEN-PRINCIPLES.md`
- `docs/governance/policy-manifest.json`
- `docs/governance/policy-manifest.schema.json`
- `docs/governance/project-gates.json`
- `docs/governance/project-gates.schema.json`
- `docs/governance/doc-checks.config.json`
- `docs/governance/architecture-rules.json`

## Verification

- Runtime context build: `npm run context:compile`
- Harness alignment check: `npm run harness:verify`
- Plan metadata check: `npm run plans:verify`
- Docs governance check: `npm run docs:verify`
- Project gate check: `npm run project:gates:verify`
- Fast profile: `npm run verify:fast`
- Full profile: `npm run verify:full`

## Operational References

- Lite onboarding: `docs/ops/automation/LITE_QUICKSTART.md`
- Engineering workflow: `docs/ops/automation/README.md`

## Governance Contract

- Human-readable rules live in `docs/governance/RULES.md` and `docs/governance/GOLDEN-PRINCIPLES.md`.
- Machine-readable rules live in JSON config and schema files in this directory.
- Generated runtime context is derived from `policy-manifest.json`; update the manifest and regenerate rather than editing generated context by hand.
- Project gates are adoption contracts. A downstream project is not production-ready until placeholders are replaced with real commands or justified as deferred/not-applicable.
- Architecture, docs, project-gate, and policy-manifest changes must run their targeted verifier before closeout.

## Change Rules

- Update schema files in the same change as machine-readable config shape changes.
- Keep config values stack-agnostic unless the file is explicitly an adopted-project override.
- Do not encode private environment names, personal paths, credentials, or provider-only runbooks in governance config.
- If a rule cannot be mechanically checked yet, document the intended future check or evidence path.
