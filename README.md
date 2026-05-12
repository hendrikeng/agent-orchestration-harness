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

1. Run `node ./scripts/harness-sync.mjs install --target /path/to/target-repo`.
2. Replace placeholders from [template/PLACEHOLDERS.md](template/PLACEHOLDERS.md).
3. Merge [template/package.scripts.fragment.json](template/package.scripts.fragment.json) into the downstream `package.json`.
4. Replace [template/docs/governance/project-gates.json](template/docs/governance/project-gates.json) with real lint, typecheck, test, build, database, browser, deploy, and security gates, or mark missing gates with a concrete rationale.
5. Run `npm run harness:verify`, `npm run context:compile`, and `npm run verify:fast` in the downstream repo.

## Agent Quickstart Prompts

Use these prompts when starting a new project from the blueprint.

Planning kickoff:

```text
We are starting a new software project from this Agent Project Blueprint.
Stay in planning mode and do not edit implementation files yet.

Build the initial project operating system:
1. define what the product does, who it serves, and which outcomes matter,
2. choose the stack, runtime, deployment posture, data model direction, and testing strategy,
3. identify critical invariants for security, authorization, data integrity, lifecycle transitions, money/numeric behavior, and reliability,
4. replace every template placeholder listed in template/PLACEHOLDERS.md with project-specific values,
5. create the initial docs/current-state, architecture, frontend, backend, security, reliability, and quality-score baseline,
6. propose the first executable future slices with acceptance criteria, dependencies, validation lanes, evidence expectations, and risk tiers,
7. call out any missing decision that blocks safe implementation.

Treat this as an OpenAI-caliber engineering blueprint: explicit contracts, small executable slices, strong defaults, proof-oriented validation, and no invented product behavior.
Stop after the decision-complete planning output unless I explicitly ask you to implement.
```

Execution kickoff:

```text
Approved. Bootstrap and execute the blueprint workflow now.

1. Install or update the template in the target repository.
2. Replace all {{...}} placeholders and run ./scripts/check-template-placeholders.sh until no placeholders remain.
3. Merge package.scripts.fragment.json into package.json and wire real project checks into verify:fast and verify:full.
4. Run npm run harness:verify, npm run context:compile, npm run docs:verify, npm run plans:verify, and npm run verify:fast.
5. Promote or create exactly one executable active slice.
6. Implement the slice with the smallest coherent code change that satisfies the acceptance criteria.
7. Update current-state docs, architecture/standards docs, validation evidence, and completed-plan closeout where the change requires it.
8. Run the strongest relevant verification available and report the exact commands and evidence.

Keep the work agent-portable: any capable coding agent must be able to resume from repository-local docs, plans, code, validation output, and evidence.
```

Quality goal prompt:

```text
Use this repository as a state-of-the-art agent-assisted engineering blueprint.
Act like a senior architecture and quality team: prefer clear boundaries, typed contracts, server-side authority, secure defaults, reliable failure handling, maintainable UI/backend structure, focused tests, and evidence-backed completion.
Do not add process for its own sake. Every rule must either prevent real bugs, improve code quality, preserve context, protect users/data, or make future changes easier to review safely.
```

## Root Commands

- `npm run test:root`
- `npm run test:template-smoke`
- `npm test`
