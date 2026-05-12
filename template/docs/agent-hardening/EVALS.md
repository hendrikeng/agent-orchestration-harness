# Eval Policy

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Eval Lifecycle

- Define stable golden tasks for high-risk and high-value workflows: planning, code edits, tool use, memory recovery, review, and closeout.
- Add targeted regression tasks for every repeated failure mode, incident, or escaped defect.
- Run the required suite on model, prompt, tool policy, runtime, or canonical-doc changes before treating the change as merge-ready.
- Track provider, model, prompt/runtime version, tool policy version, input fixture, output artifact, and evidence path for every run.
- Treat eval regressions as defects. They must be fixed, mitigated, or explicitly accepted with owner, expiry, and follow-up.
- Keep eval fixtures deterministic unless the test is explicitly measuring nondeterminism, retry behavior, or degraded-provider handling.

## Failure Taxonomy

- `hallucination`: output invents facts or behavior.
- `policy_violation`: output or action breaks explicit policy.
- `tool_misuse`: invalid tool choice, sequence, or parameter use.
- `workflow_incomplete`: task stops before required completion criteria.
- `context_loss`: agent drops active scope, prior validated state, constraints, or required evidence after interruption or compaction.
- `unsafe_write`: edit, command, API call, or external side effect exceeds user intent or approved risk tier.
- `verification_gap`: final claim is not backed by the required command, test, review, screenshot, trace, or manual evidence.
- `regression_escape`: known previous failure mode reappears without detection by the required suite.

## Release Gates

- Required suites must pass at the status declared in `docs/agent-hardening/evals.config.json`.
- Open critical and high regressions must be at or below configured maximums.
- New critical or high failure classes block release until mitigated or explicitly accepted in writing with owner and expiry.
- Changes to critical flows require updated eval coverage in the same change.
- The generated eval report must point to repository-local evidence for every required suite.
- A pass is valid only when the evidence proves the behavior under the relevant policy, model/runtime, and tool boundary.
- Manual eval evidence is acceptable only when automation is not yet available and the evidence names the reviewer, fixture, observed result, and follow-up automation path.

## Generated Artifact Contract

- Config source of truth: `docs/agent-hardening/evals.config.json`.
- Generated report artifact: `docs/generated/evals-report.json`.
- Verifier command: `npm run eval:verify`.
- Required report fields:
  - `generatedAtUtc`
  - `summary.total`, `summary.passed`, `summary.failed`, `summary.passRate`
  - `regressions.criticalOpen`, `regressions.highOpen`
  - `suites[]` with `id`, `status`, `total`, `passed`, `failed`
  - `evidence[]` repository-local references
- Recommended report fields:
  - `provider`, `model`, and runtime or prompt version where available
  - suite-level `evidence` and failure class counts when the runner supports them
  - links to incident, plan, PR, or evidence-index entries for accepted exceptions
- Gate policy:
  - Report freshness must satisfy `maxAgeDays`.
  - Pass-rate must satisfy `minimumPassRate`.
  - Open critical/high regressions must be at or below configured maximums.
  - Required suite IDs/statuses must be present and valid.
  - Evidence paths must stay inside the repository and must not contain unresolved placeholders outside template mode.
