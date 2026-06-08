# Agent Loop

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

This document names the default working loop for humans and agents. Runtime tools may automate parts of it, but the repo-local artifacts remain authoritative.

## Loop Contract

The default loop is:

1. `VISION`: read durable product direction in `VISION.md`.
2. `RULES`: read `AGENTS.md` and the nearest canonical docs for constraints.
3. `CODE`: inspect live implementation and tests before designing new behavior.
4. `PLAN`: write or update one executable plan for non-trivial work.
5. `BUILD`: implement the smallest scoped slice.
6. `CHECK`: run checks that can reject the work.
7. `FIX`: resolve failures and repeat the check loop.
8. `EVIDENCE`: record validation output, screenshots, traces, or manual proof.
9. `CLOSE`: commit, push, open PR, or hand off only when the workflow or user asks for that closeout.

## Loop Inputs

- User request, explicit constraints, and acceptance criteria.
- `VISION.md` for product direction.
- `AGENTS.md` for behavioral entrypoint rules.
- Nearest route, component, service, API handler, job, script, domain module, schema, migration, tests, constants, and generated types.
- Relevant docs under `docs/`, especially governance, security, reliability, architecture, and plan lifecycle docs.

## Checks That Can Say No

- Automated tests, type checks, builds, lint, project gates, policy verifiers, and generated-context checks.
- Browser screenshots, API traces, migration dry runs, fixture comparisons, or manual evidence when automation is not yet available.
- Review findings, unresolved plan checklist items, dirty-worktree audits, and missing evidence all count as rejection signals.
- A prompt-only self-review is never enough for non-trivial work.

## Evidence And Closeout

- Record the exact commands, results, screenshots, traces, or manual checks that prove the slice.
- Update the current plan, docs, generated context, PR notes, or evidence index when the workflow or code contract changes.
- Final claims must distinguish completed evidence, skipped validation, residual risk, and follow-up work.
- If the work cannot be completed in one slice, create or update a follow-up plan instead of stretching scope silently.

## Stop Rules

- Stop before implementation when product behavior, schema, architecture, or workflow would be invented without code, docs, or explicit user intent.
- Stop and re-scope when the request becomes multiple independent outcomes.
- Stop before privileged writes, destructive git/file operations, credential changes, production writes, or broad crawling unless explicit approval and policy coverage exist.
- Stop when no check can reject the work; add a verifier, test, fixture, screenshot, or manual evidence path first.
