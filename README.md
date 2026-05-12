# Agent Project Blueprint

Status: canonical
Owner: Platform Engineering
Last Updated: 2026-05-12
Source of Truth: This directory.

Reusable blueprint for bootstrapping high-quality agent-assisted software projects.

## What This Repo Is

- This repository is the blueprint source.
- `template/` is the install payload for adopted repositories.
- `scripts/harness-sync.mjs` installs, updates, and drift-checks that payload in downstream repos.
- `template/README.md` becomes the downstream repo root README after bootstrap.

## Blueprint Principles

- The repository is the operating system for engineering work.
- Canonical docs define current product state, architecture, standards, planning, and quality gates.
- Non-trivial work is planned as one executable slice before implementation.
- Code quality is protected through small scope, explicit contracts, focused validation, reviewable evidence, and automated checks.
- The blueprint is agent-portable: any capable coding agent should be able to rebuild context from repo-local artifacts.
- The blueprint deliberately avoids a mandatory orchestration runtime; runtime-native goals, subagents, hooks, guardrails, traces, and background work should plug into repo-local plans and evidence instead of replacing them.
- External issue trackers, hosting providers, and deployment platforms are optional integrations, not harness requirements.

## Start Here

- [template/AGENTS.md](template/AGENTS.md)
- [template/README.md](template/README.md)
- [template/docs/PLANS.md](template/docs/PLANS.md)
- [template/docs/QUALITY_SCORE.md](template/docs/QUALITY_SCORE.md)
- [template/docs/governance/RULES.md](template/docs/governance/RULES.md)
- [template/docs/ops/automation/LITE_QUICKSTART.md](template/docs/ops/automation/LITE_QUICKSTART.md)

## Bootstrap

The bootstrap has two locations:

- From this blueprint repo, install the template payload into the target repo.
- From the target repo, plan and execute adoption while the installed files still contain `{{...}}` placeholders.

Install from this blueprint repo:

```bash
node ./scripts/harness-sync.mjs install --target /path/to/target-repo
```

The install copies `template/` into the target repository root. After install, paths lose the `template/` prefix: `template/PLACEHOLDERS.md` becomes `PLACEHOLDERS.md`, `template/AGENTS.md` becomes `AGENTS.md`, and `template/docs/...` becomes `docs/...`. The sync manifest is written to `docs/ops/automation/harness-manifest.json`; downstream `.gitignore` is preserved.

Then work inside the target repo:

1. Use the planning kickoff prompt below to decide product scope, stack, invariants, placeholder values, gates, and first slices.
2. Use the execution kickoff prompt to apply those decisions to the installed template.
3. Merge `package.scripts.fragment.json` into the target `package.json`.
4. Replace `docs/governance/project-gates.json` with real lint, typecheck, test, build, database, browser, deploy, and security gates, or mark missing gates with a concrete rationale.
5. Run `npm run harness:verify`, `npm run context:compile`, and `npm run verify:fast`.

## Agent Quickstart Prompts

Use these prompts when starting a new project from the blueprint.

Planning kickoff:

```text
This repository has just been initialized from the Agent Project Blueprint.
We are inside the target repo now, and installed files may still contain {{...}} placeholders.
Stay in planning mode. Do not edit files yet.

Read AGENTS.md, PLACEHOLDERS.md, README.md, docs/PLANS.md, docs/QUALITY_SCORE.md, docs/governance/RULES.md, and the nearest existing code/package files if any.

Produce a bootstrap decision packet:
1. define what the product does, who it serves, and which outcomes matter,
2. choose the stack, runtime, deployment posture, data model direction, and testing strategy,
3. identify critical invariants for security, authorization, data integrity, lifecycle transitions, money/numeric behavior, and reliability,
4. map every placeholder in PLACEHOLDERS.md to a project-specific value or an explicit not-applicable rationale,
5. define the initial current-state, architecture, frontend, backend, security, reliability, and quality-score baseline that should be written during execution,
6. identify the real project commands that should back docs/governance/project-gates.json,
7. propose the first executable future slices with acceptance criteria, dependencies, validation lanes, evidence expectations, and risk tiers,
8. call out any missing decision that blocks safe execution.

Treat this as a production engineering blueprint: explicit contracts, small executable slices, strong defaults, proof-oriented validation, and no invented product behavior.
Stop after the decision-complete planning output. Do not replace placeholders, merge package scripts, create product code, or run verification until I approve execution.
```

Execution kickoff:

```text
Approved. Execute the bootstrap decision packet in this installed target repo.

Assume the template has already been installed into the current repository root. If AGENTS.md, PLACEHOLDERS.md, package.scripts.fragment.json, or docs/governance/project-gates.json are missing, stop and report that the template install step has not happened.

1. Replace all {{...}} placeholders in installed files using the approved decision packet; keep PLACEHOLDERS.md as the placeholder inventory.
2. Merge package.scripts.fragment.json into package.json without deleting unrelated existing project scripts.
3. Wire docs/governance/project-gates.json to real project commands for lint, typecheck, unit tests, build, and any applicable integration, migration, browser, security, release, or deploy checks.
4. Run ./scripts/check-template-placeholders.sh until no unresolved placeholders remain outside the documented inventory.
5. Run npm run harness:verify, npm run context:compile, npm run docs:verify, npm run plans:verify, npm run project:gates:verify, and npm run verify:fast.
6. Create or update exactly one executable future or active slice from the approved first-slice plan.
7. Implement only that slice if execution approval includes implementation; otherwise stop after verified bootstrap and slice creation.
8. Update current-state docs, architecture/standards docs, validation evidence, and completed-plan closeout where the executed change requires it.
9. Run the strongest relevant verification available and report the exact commands and evidence.

Keep the work agent-portable: any capable coding agent must be able to resume from repository-local docs, plans, code, validation output, and evidence.
```

## Root Commands

- `npm run test:root`
- `npm run test:template-smoke`
- `npm test`
