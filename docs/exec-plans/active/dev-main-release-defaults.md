# Generic Dev and Main Release Defaults

## Metadata

- Plan-ID: dev-main-release-defaults
- Status: validation
- Priority: p1
- Owner: Platform Engineering
- Acceptance-Criteria: Ship provider-neutral dev/main CI, implementation and release PR contracts, and release/source tags without requiring hosted testing environments.
- Delivery-Class: ops
- Dependencies: none
- Spec-Targets: README.md, template/docs/ops/releases/README.md
- Implementation-Targets: template/.github/, template/scripts/automation/release-support-lib.mjs, template/scripts/automation/pr-contract-lib.mjs, associated tests
- Risk-Tier: high
- Validation-Lanes: always
- Security-Approval: not-required
- Done-Evidence: docs/exec-plans/evidence-index/dev-main-release-defaults.md

## Already-True Baseline

The user approved reuse of the generic release work, with only `dev` and `main` as long-lived blueprint branches.
Staging, Preview, providers, deployment triggers, and multi-repository coordination remain project-specific.
The template already provides slice/fix PRs into `dev` and release PRs into `main`.
Before this change, the release workflow required merge commits and created only a landed tag.
The PR contract also required Browser Smoke and Release Preview despite those being project-specific capabilities.
Workflows are project-owned distribution files. Framework scripts and release docs remain managed.
This source-only plan is outside `template/` and must not enter the install payload.

## Must-Land Checklist

- [x] `dmr-01` Run generic CI for dev/main PRs and integrated pushes, with fast checks on slice/fix pushes.
- [x] `dmr-02` Create release/source tags atomically and consume source boundaries without requiring merge commits.
- [x] `dmr-03` Remove mandatory hosted Preview/browser assumptions from release contracts and explain project-specific deployment ownership.
- [ ] `dmr-04` Add focused regression coverage and validate template adoption compatibility.

## Validation

Run focused PR/release tests and the template smoke check. Record exact results and any tool restrictions.
Do not deploy, configure provider credentials, or synchronize downstream projects.

Implementation and scoped review are complete. The Git guard blocked one focused test and the full adoption smoke result.
The plan stays in validation until an authorized test environment completes those checks.
Exact commands, results, and remaining gaps are in the evidence index.

## Deferred Follow-Ons

- Project-owned hosted environments and deployment orchestration.
- Automatic downstream migration of project-owned workflows or PR templates.
