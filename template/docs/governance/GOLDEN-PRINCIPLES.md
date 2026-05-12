# Golden Principles

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Principles

- Correctness over speed.
- Explicit invariants over implied behavior.
- Shared contracts and primitives over divergence.
- Security and boundary isolation by default.
- Mechanical checks over manual interpretation.
- Evidence over claims.
- Canonical ownership over duplicate guidance.
- Small complete slices over broad partial refactors.
- Safe failure and recovery over silent fallback behavior.
- Real project gates over placeholder confidence.

## Mechanical Enforcement Map

- Fast iteration profile: `npm run verify:fast`
- Full merge profile: `npm run verify:full`
- Runtime context compiler: `npm run context:compile`
- Docs governance: `npm run docs:verify`
- Project gates: `npm run project:gates:verify`
- Architecture gates: `npm run architecture:verify`
- Agent hardening: `npm run agent:verify` and `npm run eval:verify`

## Application Rules

- When principles conflict, choose the option that protects user data, security boundaries, and long-term maintainability.
- Do not add process for its own sake; add enforceable rules that prevent real failure modes.
- A repeated review comment should become a doc, test, lint rule, or verifier.
- A release or completion claim is credible only when backed by the relevant evidence path.
