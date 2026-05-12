# Agent Run Control

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Goal-Driven Run Control

- Treat a goal as the durable execution contract: user intent, acceptance criteria, constraints, validation path, current state, blockers, and completion evidence.
- Prefer provider-native goal, task, plan, session, trace, and background-run primitives when they improve reliability, but do not make any provider session the repository source of truth.
- Keep the repo-local plan and evidence authoritative for work that spans sessions, agents, branches, or pull requests.
- Before editing, translate the request into the smallest verifiable outcome and identify the check that will prove it.
- During execution, update the current plan, evidence, or docs whenever the goal boundary changes.
- Stop and re-scope when the requested goal becomes multiple independent outcomes, requires new security approval, or no longer fits one executable slice.
- Completion requires a prompt-to-artifact audit: map every explicit requirement to real evidence, then close only the items proven by code, docs, checks, screenshots, traces, or accepted manual evidence.

## Delegation and Handoffs

- Use delegation for bounded sidecar work that can run independently without blocking the immediate next local step.
- Do not delegate the critical-path task when the next action depends on the result; keep urgent blocking work in the main run.
- For parallel implementation, delegate by ready future or active plan, not by vague roadmap theme.
- Each delegated task must name the expected output, allowed write scope, relevant files, validation expectation, and whether the worker may modify files.
- Delegated agents are not a substitute for ownership. The main run remains responsible for integration, review, validation, and closeout.
- Keep subagents focused: reviewer, tester, investigator, migrator, UI verifier, release checker, security reviewer, or similar single-purpose roles.
- Grant delegated agents the narrowest practical tool access and forbid destructive, privileged, production, credential, branch, and publish actions unless the user approved that exact action.
- Record meaningful handoff outputs in repo-local evidence, plans, or review notes; do not rely on hidden agent transcripts for future recovery.
- When multiple agents touch code, use disjoint ownership boundaries and reconcile conflicts by reading current files, not by reverting unrelated work.

## Provider Adapter Contract

- Provider-native execution machinery is optional; repo-local contracts, validation, and evidence remain mandatory.
- Provider-specific adapter files are thin entrypoints. They may explain how Codex, Claude Code, OpenAI Agents SDK, hosted MCP tools, hooks, subagents, guardrails, or tracing map onto this repository, but they must defer to `AGENTS.md` and canonical docs.
- Prefer deterministic checks, hooks, guardrails, typed tool schemas, and structured outputs over prompt-only reminders for repeatable safety constraints.
- Use model handoffs or subagents only when the responsibility boundary is explicit and the receiving agent has enough context to succeed without inheriting irrelevant main-thread state.
- Use tool-level validation for tool calls whenever possible; workflow-level input/output checks alone are not enough for delegated or multi-agent tool paths.
- Preserve traceability for model calls, tool calls, handoffs, guardrails, approvals, file edits, and validation results in the run trace or evidence path.
- Treat provider memory, conversation state, encrypted reasoning items, background tasks, and compacted context as accelerators, not authority. Durable decisions must land in repo-local docs, plans, tests, manifests, or evidence.
- If provider behavior conflicts with repo policy, repo policy wins until an explicit canonical doc change lands.

## Completion Audits

- Restate the objective as concrete deliverables or success criteria before claiming completion.
- Build a prompt-to-artifact checklist for every explicit requirement, named file, command, test, gate, and deliverable.
- Inspect actual files, command output, test results, generated artifacts, evidence paths, and dirty worktree state for each checklist item.
- Verify that passing tests, manifests, generated reports, or verifier output directly cover the objective before relying on them.
- Mark uncertainty as incomplete. Do more verification, narrow the claim, or create a follow-up future slice with owner, rationale, and acceptance criteria.
- Final status must separate completed evidence, residual risk, skipped validation, and follow-up work.
