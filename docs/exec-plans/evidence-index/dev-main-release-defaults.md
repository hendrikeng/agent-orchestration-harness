# Dev and Main Release Defaults: Evidence

- Plan-ID: dev-main-release-defaults
- Plan: `docs/exec-plans/active/dev-main-release-defaults.md`
- Status: implementation complete, validation limited by the local Git guard

## Evidence Summary

- The template keeps only `dev` and `main` as default long-lived branches.
- CI runs fast and full checks on integrated branches. Slice and fix pushes run fast checks.
- Release PRs use their exact head SHA and the previous source boundary when available.
- The release workflow validates dates and creates landed/source tags with one atomic push.
- Browser Smoke and Release Preview are no longer mandatory PR markers. Projects retain ownership of deployment workflows.
- Workflow regression tests stay in the blueprint source, outside the install payload. They do not constrain project-owned downstream workflows.
- No dependencies, hosted environments, credentials, or downstream repositories changed.

## Focused Validation

Commands ran from the blueprint repository:

```sh
node --test scripts/release-workflow.test.mjs template/scripts/automation/pr-contract-lib.test.mjs template/scripts/automation/release-support-lib.test.mjs
npm run test:template-smoke
ruby -e 'require "yaml"; ARGV.each { |file| YAML.load_file(file); puts "YAML OK: #{file}" }' template/.github/workflows/ci.yml template/.github/workflows/release-tag.yml
git diff --check
```

- Focused tests: 9 passed. The Git-history regression stopped at `git checkout -b dev` in a temporary test repository.
- Template smoke: PR-template validation, harness alignment, plan metadata, context generation, documentation checks, and eval integrity passed.
- The smoke harness ran 99 tests. Of those, 98 passed and the same Git-history test stopped at the guard.
- The smoke command did not reach its final cleanup and drift checks. It is not a full pass.
- Both workflow YAML files parsed successfully. The whitespace check passed.

The guard reported:

```text
git yolo guard: unsupported unattended git command: checkout
```

The guard remained enabled. No alternative Git launcher was used.
The Git-history regression and complete template smoke still need an authorized local or CI run.
Hosted tag creation and GitHub branch protection remain unverified.

## Commit Review

Release machinery and managed installation files triggered `autoreview`.
The change adds no dependency, architectural layer, or configurable surface and stays below the non-test complexity threshold. No separate complexity review was required.

The scoped local review used Codex Astra at medium thinking and a P2 threshold.
Result: `scoped-clean`, with no accepted or actionable findings.
The reviewer treated the local guard restriction as a validation limitation, not a product defect.

## Remaining Validation

- Run the Git-history regression in an authorized test environment.
- Complete the template smoke check.
- Validate tag creation through the project-owned GitHub workflow before relying on it for a release.
