# Core Beliefs

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Agent-First Beliefs

- Agents follow canonical docs as source of truth.
- Humans set intent and constraints; agents execute scoped changes.
- Docs, tests, checks, and evidence define done.
- Fresh agents must be able to rebuild context from repository-local artifacts without relying on chat history.
- The best agent workflow is boring to review: clear scope, small changes, explicit validation, and no invented state.

## Engineering Beliefs

- Correctness beats speed in sensitive domains.
- Shared contracts and primitives beat local forks.
- Production behavior must be explicit and testable.
- Simple ownership beats clever abstraction.
- Typed or structured boundaries beat ad hoc string conventions where the stack supports them.
- Root-cause fixes beat local patches that leave the failure mode available elsewhere.
- Every durable rule should protect users, data, maintainability, delivery speed, or review quality.

## Operational Beliefs

- Keep policies centralized and discoverable.
- Keep checks mechanical where possible.
- Keep historical plans separate from active policy docs.
- Treat deployment, release, migration, and privileged operations as evidence-producing workflows.
- Make exceptions explicit, owned, temporary, and visible in plans or evidence.
- Do not add process to look mature; add process only when it prevents real mistakes or improves safe throughput.

## Decision Bias

- Prefer the smallest complete slice over a broad partially finished refactor.
- Prefer existing local patterns until there is a concrete reason to introduce a new one.
- Prefer explicit acceptance criteria and validation over optimistic claims.
- Prefer fixing the canonical owner over creating a parallel policy source.
- Prefer safe failure and clear recovery over silent fallback behavior.
