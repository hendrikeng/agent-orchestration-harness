# Generated Docs

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This directory.

Generated artifacts are rebuildable outputs derived from canonical docs, policy checks, or measured runs. They are navigationally important, but they are not the primary hand-maintained source of truth.

## Core Generated Artifacts

- `docs/generated/AGENT-RUNTIME-CONTEXT.md`: compact policy snapshot compiled from governance rules for agent sessions.
- `docs/generated/article-conformance.json`: conformance summary derived from the repo's article/check rules.
- `docs/generated/db-schema.md`: database schema snapshot generated from the adopted project's canonical schema and migrations when a database exists.
- `docs/generated/evals-report.json`: agent-hardening evaluation summary.

## Optional Repo-Local Generated Artifacts

- External export reports when the repository adds extra generation commands beyond the harness baseline.

## Rules

- Regenerate artifacts from canonical policy, schema, or telemetry sources instead of hand-editing generated outputs.
- If a generated artifact becomes a routine entrypoint, surface it from `docs/MANIFEST.md` or `docs/README.md`.
- Remove generated artifacts that are no longer produced by any documented contract or script.
- Generated artifacts must name their source and generation command when the format supports it.
- Generated artifacts may contain template placeholders only when the verifier explicitly supports template mode.
- Do not use generated artifacts as the canonical owner for policy. Fix the source docs or config and regenerate.
- If generated output changes unexpectedly, inspect the source inputs before committing the generated diff.
