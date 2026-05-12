# Agent Runtime Context

Status: generated
Owner: {{DOC_OWNER}}
Last Updated: 2026-05-12
Source of Truth: Derived from AGENTS.md and docs/governance/policy-manifest.json.

## Mission

- Use canonical entrypoints to rebuild context quickly.
- Follow the repo-local queue: `docs/future/ -> docs/exec-plans/active/ -> docs/exec-plans/completed/`.
- Treat plans, docs, validation output, change summaries, and evidence as the durable memory system.
- Keep agent-specific instructions subordinate to repo-local canonical docs.

## Execution Model

- mode: repo-local-engineering-system
- queue: docs/future
- queue: docs/exec-plans/active
- queue: docs/exec-plans/completed
- source: canonical docs
- source: current product state
- source: execution plans
- source: validation output
- source: evidence indexes

Canonical entrypoints:
- `AGENTS.md`
- `README.md`
- `ARCHITECTURE.md`
- `docs/MANIFEST.md`
- `docs/README.md`
- `docs/PLANS.md`
- `docs/agent-hardening/RUN_CONTROL.md`
- `docs/governance/RULES.md`
- `docs/generated/AGENT-RUNTIME-CONTEXT.md`
- `docs/product-specs/CURRENT-STATE.md`

## Hard Safety Rules

- `correctness_over_speed`: Correctness over speed for critical domain data, permissions, external effects, and user-visible workflows.
- `server_side_authority`: Sensitive writes, privileged checks, billing or payment actions, identity decisions, and external side effects stay server-side.
- `no_fake_success_paths`: Do not fabricate production success paths, silent fallbacks, or operational outcomes.
- `docs_are_part_of_done`: Behavior, workflow, architecture, security, reliability, and boundary changes must update canonical docs in the same slice.
- `planning_only_stops_in_future`: Planning-only work stops in docs/future and must not spill into source or test changes without explicit implementation intent.
- `one_slice_one_plan`: One executable slice maps to one future or active plan file; split broader work into ordered slices with explicit dependencies.
- `review_is_required`: Non-trivial implementation work needs review scrutiny for correctness, security, reliability, missing tests, docs, and evidence before it is treated as done.
- `no_destructive_git_without_instruction`: Never run destructive git or file commands without explicit written instruction.
- `runtime_native_execution_optional`: Runtime-native goals, subagents, handoffs, hooks, guardrails, traces, and background runs may be used, but the repository remains the durable control plane.
- `quality_bar_is_binding`: Non-trivial changes must clear the quality bar for correctness, contracts, maintainability, reliability, security, user experience, and evidence.
- `canonical_policy_owner`: General engineering rules live once in their canonical owner; supporting references and generated artifacts must not fork policy.
- `real_project_gates_required`: Adopted projects must wire real lint, typecheck, test, and build gates or explicitly justify deferred or not-applicable gates in docs/governance/project-gates.json.

## Verification Profiles

- fast: npm run context:compile ; npm run docs:verify ; npm run architecture:verify ; npm run agent:verify ; npm run plans:verify ; npm run harness:verify ; npm run project:gates:fast
- full: npm run verify:fast ; npm run project:gates:full ; project-specific typecheck/build/test gates
- repo health: project-specific lint/build/test commands

## Execution Quality

- goal: Translate implementation requests into verifiable goals before editing.
- goal: For multi-step work, pair each planned step with the check that proves it.
- goal: Loop on the smallest relevant check until the goal is verified, then run the required gate before closeout.
- scope: Prefer the smallest implementation that satisfies the must-land checklist.
- scope: Every changed line should trace to the user request, active plan, or required validation.
- scope: Use abstractions only when they clarify ownership, remove real duplication, or create a stable cross-layer contract.
- assumption: State material assumptions when intent has multiple plausible interpretations.
- assumption: Ask or stop rather than silently choosing a risky path.
- assumption: Do not claim production readiness from proxy signals unless the checks cover the changed behavior.

## Run Control

- goal: Treat user intent, acceptance criteria, constraints, validation path, blockers, and completion evidence as the goal contract.
- goal: Use runtime-native goal, task, background-run, session, trace, and plan primitives when they improve reliability.
- goal: Keep repo-local plans and evidence authoritative for work spanning sessions, agents, branches, or pull requests.
- goal: Stop and re-scope when one goal becomes multiple independent outcomes or requires new security approval.
- delegate: Delegate bounded sidecar work only when it can run independently without blocking the immediate next local step.
- delegate: Keep urgent critical-path work in the main run when the next action depends on the result.
- delegate: Every delegated task must name output, allowed write scope, relevant files, validation expectation, and tool boundaries.
- delegate: The main run remains responsible for integration, review, validation, and closeout.
- runtime: Prefer deterministic checks, hooks, guardrails, typed tool schemas, and structured outputs over prompt-only reminders for repeatable constraints.
- runtime: Treat runtime memory, conversation state, encrypted reasoning items, background tasks, and compacted context as accelerators, not authority.
- runtime: If runtime behavior conflicts with repo policy, repo policy wins until a canonical doc change lands.
- audit: Restate the objective as concrete deliverables or success criteria before claiming completion.
- audit: Map every explicit requirement, named file, command, test, gate, and deliverable to real evidence.
- audit: Inspect actual files, command output, generated artifacts, evidence paths, and worktree state for each checklist item.
- audit: Mark uncertainty as incomplete and either verify more, narrow the claim, or create a follow-up future slice.

## Memory Posture

- do: Treat the repo as the main operating system for agent work.
- do: Keep plans, docs, validation output, PR context, and evidence in-repo.
- do: Use the active or future plan as the current execution contract.
- do: Keep future and active must-land items as explicit checkboxes with stable backticked IDs.
- do: Prefer nearest live code examples before inventing new patterns.
- do: Treat runtime-native goals, sessions, background runs, compacted context, and encrypted reasoning items as transient execution aids unless their decisions are written back into repo-local artifacts.
- improve first: Better active-plan quality and explicit must-land scopes.
- improve first: Better PR summaries and evidence indexes.
- improve first: Better generated context quality and canonical doc navigation.
- improve first: Better validation coverage before widening workflow machinery.
- improve first: Better canonical rule ownership before adding duplicate guidance.
- not yet: Do not treat provider chats as durable working memory.
- not yet: Do not use provider session state as the only record of goal progress, handoff decisions, validation evidence, or completion claims.
- not yet: Do not create agent-specific policy forks to compensate for thin canonical docs.
- escalate when: Canonical docs repeatedly fail to let a fresh agent resume safely.
- escalate when: Important operational context is living only in chat or terminal scrollback.
- escalate when: Manual promotion or review discipline keeps breaking because the contract is under-specified.
- safe rule: Keep work state repo-local through clear docs, current plans, validation, and evidence.

## Execution Checklist

- Read `AGENTS.md`, `README.md`, the current plan when applicable, and the nearest live code before editing.
- Translate the request into verifiable goals; for multi-step work, pair each step with its check.
- Planning-only work stops in `docs/future/`.
- Update canonical docs in the same slice when behavior, workflow, architecture, security, or reliability boundaries change.
- Run the required validation commands and record evidence before closeout.

Generated by `npm run context:compile`.
