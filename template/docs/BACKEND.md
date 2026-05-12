# Backend Standards

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Current Stack

- {{BACKEND_STACK}}
- {{DATA_STACK}}
- Shared contracts/types are consumed from the project contract layer.
- Server-side authority is enforced for sensitive operations.

## Backend Quality Bar

- Every write path names its actor, authorization boundary, validation shape, persistence contract, and post-write invalidation or response shape.
- Schema-backed changes update schema, migrations, queries/repositories, validations, action/API payloads, and UI mappings in the same slice unless a plan explicitly stages them.
- Data-access modules should return shapes that are tight, typed, and stable enough for consumers without leaking route-local UI concerns.
- External integrations must be isolated behind service boundaries with timeout, retry, idempotency, redaction, and operator-recovery expectations that match the risk.
- Scripts or jobs that mutate data need targeting, dry-run or preview behavior where practical, logging, and rollback/fix-forward notes in plan evidence.
- Analytics and logging paths must not block core product flows unless the product requirement explicitly makes them part of the transaction.

## API And Boundary Rules

- Keep API handlers/controllers thin and domain services explicit.
- Enforce authorization and scope boundaries server-side.
- Validate inbound payloads at boundaries before persistence, permission decisions, or external effects.
- API routes/controllers should depend on shared logic, auth, services, and data modules, not UI components or route-local presentation code.
- Keep request/response shapes explicit and stable.

## Data And Persistence Rules

- Use explicit schemas/contracts at persistence boundaries.
- Keep transaction boundaries explicit for multi-step critical writes.
- Preserve auditability for critical state mutations.
- Check existing relations and current query patterns before introducing new joins, many-to-many flows, or denormalized views.
- Keep query shapes tight; do not overfetch or broadly reshape when a smaller select or existing contract is enough.

## Migration Integrity

- Treat migrations, snapshots, generated schema artifacts, and seed data as one reviewable contract when the adopted stack uses them.
- Do not hand-edit generated migration artifacts as the default path; regenerate from the canonical schema source when the stack supports it.
- If an unmerged local migration must change, prefer regenerating the latest local artifact set over stacking corrective migrations that obscure intent.
- Data migrations and backfills require dry-run or preview behavior where practical, target selection, operator-readable logs, and rollback or fix-forward notes.

## Mutation Design Review

- What authority decides this user or process can perform this action?
- Which fields are trusted, normalized, rejected, or server-derived?
- What happens on partial failure, duplicate submission, stale data, replay, or timeout?
- Which cache paths, projections, indexes, analytics events, notifications, or downstream summaries need refresh?
- Which focused test or manual evidence proves the risky path?

## Service And Integration Boundaries

- Keep third-party API glue in services/adapters, not inline inside UI or route handlers.
- Use least-privilege credentials and avoid passing broad clients across layers.
- Redact secrets, tokens, private request bodies, and sensitive free text from logs and evidence.
- Treat webhooks, feeds, uploads, imports, and external callbacks as untrusted and replayable.

## Operational Tooling

- Treat maintenance, migration, backfill, seed, and verification scripts as real operational surfaces, not scratch files.
- Do not make app runtime code depend on script-only helpers.
- For data-changing scripts, require target selection, dry-run/preview when practical, operator-readable logs, and rollback or fix-forward notes.

## Backend Validation Expectations

- Focused tests should cover changed authorization, validation, persistence, transaction, idempotency, and integration behavior.
- Contract changes should prove at least one producer and one consumer when the boundary crosses modules or runtime surfaces.
- Migration and data-repair work should include evidence for schema state, generated artifacts, and representative read/write behavior after the change.
- If a backend change intentionally lacks automated coverage, record the reason and the manual evidence path in the active or completed plan.

## Current Workspace Entry Points

- {{BACKEND_ENTRYPOINT_1}}
- {{BACKEND_ENTRYPOINT_2}}
