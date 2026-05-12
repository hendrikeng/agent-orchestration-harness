# Documentation README

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

This file is the navigation and usage entrypoint for `docs/`. Use `docs/MANIFEST.md` as the completeness manifest for first-class docs and folders.

## Entry Points

- Canonical manifest: `docs/MANIFEST.md`
- Quality scorecard: `docs/QUALITY_SCORE.md`
- Reliability model: `docs/RELIABILITY.md`
- Security model: `docs/SECURITY.md`
- Product sense: `docs/PRODUCT_SENSE.md`
- Design intent: `docs/DESIGN.md`
- Frontend standards: `docs/FRONTEND.md`
- Backend standards: `docs/BACKEND.md`
- Agent hardening policy: `docs/agent-hardening/README.md`
- Agent run control: `docs/agent-hardening/RUN_CONTROL.md`
- Governance policy: `docs/governance/README.md`
- Governance rules: `docs/governance/RULES.md`
- Golden principles: `docs/governance/GOLDEN-PRINCIPLES.md`
- Policy manifest: `docs/governance/policy-manifest.json`
- Project gates: `docs/governance/project-gates.json`
- Architecture rules: `docs/governance/architecture-rules.json`
- Architecture map: `docs/architecture/README.md`
- Architecture topology: `docs/architecture/TOPOLOGY.md`
- Dependency rules: `docs/architecture/DEPENDENCY-RULES.md`
- Design docs: `docs/design-docs/README.md`
- Deployment model: `docs/deploy/README.md`
- Environment model: `docs/env/README.md`
- Product specs index: `docs/product-specs/README.md`
- Product state: `docs/product-specs/CURRENT-STATE.md`
- References index: `docs/references/README.md`
- UI contracts: `docs/ui/README.md`
- UI intent registry: `docs/ui/INTENTS.md`
- Plan workflow: `docs/PLANS.md`
- Future queue: `docs/future/README.md`
- Execution plans index: `docs/exec-plans/README.md`
- Active plans index: `docs/exec-plans/active/README.md`
- Active evidence intake: `docs/exec-plans/active/evidence/README.md`
- Completed plans index: `docs/exec-plans/completed/README.md`
- Evidence index: `docs/exec-plans/evidence-index/README.md`
- Ops runbooks: `docs/ops/README.md`
- API operations: `docs/ops/api/README.md`
- Engineering workflow: `docs/ops/automation/README.md`
- Lite quickstart: `docs/ops/automation/LITE_QUICKSTART.md`
- Outcomes scorecard: `docs/ops/automation/OUTCOMES.md`
- GitHub interop mapping: `docs/ops/automation/INTEROP_GITHUB.md`
- Release operations: `docs/ops/releases/README.md`
- Release mapping: `docs/ops/releases/release-mapping.md`
- Generated artifact index: `docs/generated/README.md`
- Runtime context snapshot: `docs/generated/AGENT-RUNTIME-CONTEXT.md`

## Documentation Classes

- Live canonical policy: hand-maintained docs, machine-readable governance, and harness scripts/checks that define current engineering rules.
- Supporting local guidance: feature references and agent/provider adapter entrypoints. Keep them concise and subordinate to canonical docs.
- Historical evidence: completed plans and evidence-index files. Preserve delivery history; fix metadata and links, but do not rewrite them into current policy.
- Generated artifacts: rebuildable outputs derived from canonical policy or measured runs, such as `docs/generated/*`.
- Derived platform surfaces: optional repo-local exports or scaffolds for platform-native agents; these are scaffolds, not canonical policy.

## Layering Model

- `AGENTS.md`: map and constraints.
- `README.md`: product summary and navigation entrypoint.
- `ARCHITECTURE.md` + `docs/architecture/*`: architecture truth and dependency rules.
- `docs/agent-hardening/*`: mandatory agent run-control/eval/observability/tool/memory policy.
- `docs/FRONTEND.md` and `docs/BACKEND.md`: implementation-side standards by runtime surface.
- `docs/governance/project-gates.json`: project-specific compiler, lint, test, build, migration, browser, release, and deployment gates.

## Agent Consumption Order

- Humans and general-purpose agents start with `AGENTS.md`, `README.md`, and `docs/MANIFEST.md`.
- Agents consume `docs/generated/AGENT-RUNTIME-CONTEXT.md`, the current plan when applicable, nearest live code, and only the evidence needed for the active slice.
- If a repository chooses to export platform-native scaffolds, treat them as optional derived surfaces described by `docs/ops/automation/INTEROP_GITHUB.md` rather than as canonical policy.
- When canonical policy changes, regenerate derived surfaces instead of editing generated or exported files by hand.

## Authoring Rules

- Do not duplicate the full navigation index into `README.md` or `AGENTS.md`; keep this file as the exhaustive docs navigation surface.
- Keep docs concise, canonical, and linked from `AGENTS.md`/`README.md`/`docs/MANIFEST.md`.
- Tighten the canonical rule owner first, then update generated context and enforcement checks when the rule is machine-readable.
- Update docs in the same change as behavior or boundary changes.
- Do not use the root `README.md` as a rolling delivery log; keep it to stable orientation, workflow, stack, architecture links, and major capability areas.
- Put detailed current behavior in `docs/product-specs/CURRENT-STATE.md` and delivery evidence in completed plans plus evidence indexes.
- Prefer canonical docs over ad-hoc notes.
- Use one executable slice per future/active plan file and express larger efforts with multiple plan files linked by `Dependencies`.
- Keep `## Already-True Baseline`, `## Must-Land Checklist`, and `## Deferred Follow-Ons` explicit so broader vision does not silently become executable scope.
- Keep plan metadata limited to the supported fields verified by `npm run plans:verify`.
- Do not move platform-specific agent instructions into canonical governance docs unless they are truly cross-provider policy.
