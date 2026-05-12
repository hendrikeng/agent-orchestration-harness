# Architecture Layers

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Layer Order

1. Types and contracts
2. Config
3. Repository and data access
4. Service and domain logic
5. Runtime adapters
6. UI and presentation

## Dependency Direction

- Higher layers can depend on lower layers.
- Lower layers cannot depend on higher layers.
- Shared contracts/types form stable boundaries.
- Cross-cutting utilities must sit at the lowest layer they honestly require.
- A dependency that needs request/session state, framework objects, external side effects, or environment reads is not a pure lower-layer dependency.

## Layer Responsibilities

- Types and contracts: schemas, DTOs, generated types, value objects, constants, and side-effect-free validation contracts.
- Config: environment parsing, feature flags, provider endpoints, runtime limits, and validated settings.
- Repository and data access: persistence, queries, storage adapters, migrations, and external data-source adapters.
- Service and domain logic: business rules, state transitions, authorization decisions, invariants, and transactional workflows.
- Runtime adapters: API handlers, controllers, jobs, webhooks, CLIs, queues, schedulers, and framework glue.
- UI and presentation: routes, components, forms, client state, rendering, accessibility, and interaction behavior.

## Boundary Rules

- Domain logic belongs in services, not in UI components, controllers, jobs, or scripts.
- Authorization and privileged writes belong server-side at the service/runtime boundary, never in presentation-only code.
- Data-access modules expose explicit methods and typed results; callers should not reach through to raw storage clients unless the repository contract says so.
- Runtime adapters translate transport concerns into domain/service calls and translate results into protocol-specific responses.
- UI code may call approved client APIs and shared presentation helpers; it must not import server-only services, repositories, secrets, or privileged config.
- Config reads should be centralized and validated before use. Avoid scattered `process.env` reads outside config modules and bootstrapping code.
- Shared helpers must not become dumping grounds. If a helper knows a domain rule, put it in the owning domain/service layer.

## Review Checklist

- Does each changed file belong to one clear layer?
- Does every new import point downward or to an explicitly allowed peer contract?
- Are server-authority, data integrity, and external side effects kept out of lower-trust layers?
- Are generated types/contracts refreshed and committed with the change when needed?
- Is `docs/governance/architecture-rules.json` still aligned with the actual imports and tags?
