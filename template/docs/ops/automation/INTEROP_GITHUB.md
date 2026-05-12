# GitHub Interop

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Purpose

Describe the optional GitHub mapping for projects that use GitHub pull requests and Actions.
Canonical policy still lives in repository docs.

## Recommended Mapping

- Pull requests carry the change summary, validation summary, docs touched, and risk notes.
- Branch protection should require review and the project’s chosen fast/full gates.
- PR templates should separate planned slices, small fixes, and releases when those lanes are adopted.
- CODEOWNERS should route security, identity, payment, migration, and governance-sensitive paths to appropriate owners.
- GitHub Actions should call repository scripts rather than duplicating policy in workflow YAML.
- The generic `ci` workflow calls `pr:verify`, `plans:verify:closeout`, `verify:fast`, `verify:full`, and `release:verify`; add service-specific preview/deploy workflows only after documenting them in ops docs.
- The generic release-tag workflow tags merged `release/YYYY.MM.DD.N` PRs into `main` as `vYYYY.MM.DD.N`.

## Branch And PR Lanes

- `slice/* -> dev`: planned implementation slice using the slice PR template.
- `fix/* -> dev`: small, isolated, low-risk fix using the fix PR template.
- `release/YYYY.MM.DD.N -> main`: release promotion using the release PR template.
- Repositories that use different branch names must update workflow YAML, PR verification, release docs, and this mapping together.

## Required Care

- Keep GitHub-specific files derived from canonical docs and scripts.
- Do not make GitHub the only place a rule exists.
- If a check fails often for unclear reasons, improve the repository script or documentation rather than weakening branch protection.
- Do not put secrets or private operational data in PR templates, workflow logs, or public check annotations.
- CODEOWNERS is a review-routing tool, not a substitute for server-side authorization, tests, or release evidence.
