# Design Docs

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Documents

- `docs/design-docs/CORE-BELIEFS.md`
- `docs/design-docs/ENGINEERING-INVARIANTS.md`
- `docs/design-docs/UI-STANDARDS.md`
- `docs/design-docs/GIT-SAFETY.md`

## Contract

- These docs define cross-repo engineering, UI, and repository-safety expectations.
- They are blueprint defaults. Adopted projects may specialize them, but should keep the same source-of-truth shape and verification discipline.
- Product-specific behavior belongs in `docs/product-specs/CURRENT-STATE.md` or domain docs, not in this folder.
- Architecture-specific boundaries belong in `ARCHITECTURE.md` and `docs/architecture/`.
- Security, reliability, deployment, and operations details should link to their canonical docs rather than duplicate policy here.

## Ownership

- `CORE-BELIEFS.md` owns principles and decision posture.
- `ENGINEERING-INVARIANTS.md` owns non-negotiable implementation and quality expectations.
- `UI-STANDARDS.md` owns reusable UI and interaction standards.
- `GIT-SAFETY.md` owns repository mutation, commit, and branch safety.

## Review Rules

- Keep standards short enough to be read during implementation and specific enough to be enforced during review.
- Promote repeated review comments into these docs only when they are broadly useful across projects.
- If a rule needs mechanical enforcement, add or update the relevant verifier instead of relying only on prose.
- Avoid duplicating rules from another canonical owner; link to that owner and keep this folder focused on design and engineering posture.
