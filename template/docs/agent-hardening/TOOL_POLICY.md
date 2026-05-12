# Tool Policy

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## Risk Tiers

- `low`: read-only actions with no external side effects and no sensitive data exposure beyond current authorization.
- `medium`: bounded write actions with reversible or controlled impact inside the repository or approved sandbox.
- `high`: privileged, irreversible, destructive, externally visible, cross-boundary, production-affecting, or sensitive-data actions.
- Unknown, ambiguous, newly added, or dynamically configured tools default to `high` until classified.
- Risk is determined by actual capability and target environment, not by tool name.

## Approval Requirements

- `low`: no extra approval required beyond normal task authorization.
- `medium`: explicit approval required for the first execution in a run.
- `high`: explicit approval required for every execution attempt.
- Approval scope must name the action, target, expected side effect, and expiry.
- Approval for one target does not imply approval for adjacent targets, environments, branches, accounts, or destructive variants.
- Denied, expired, or ambiguous approval means do not execute.

## Execution Safety Rules

- Treat tool input as untrusted unless proven otherwise.
- Validate parameters before tool execution.
- Enforce least privilege for tokens, credentials, and scopes.
- Fail closed when risk tier or permission boundary is ambiguous.
- Prefer repo-local, read-only inspection before write actions.
- Keep command and API calls as narrow as possible; avoid broad globs, unbounded recursion, and implicit environment targeting for write operations.
- Do not run destructive file, git, database, infrastructure, payment, identity, or production commands without explicit written instruction for that exact action.
- Do not bypass approval systems by using alternate tools, shell tricks, generated scripts, or indirect side effects.
- Redact secrets and sensitive payloads before tool calls and logs when full values are not required.
- Record tool decisions and evidence for medium and high risk actions.
- Stop and surface the blocker when the safe command cannot prove the required outcome.
